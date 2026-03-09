import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/messages
 * Returns conversations for the current user with last message, unread count, and members.
 * Auth required.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Find all conversations where this user is a member
    const memberships = await prisma.conversationMember.findMany({
      where: {
        userId,
      },
      select: {
        conversationId: true,
      },
    });

    const conversationIds = memberships.map((m) => m.conversationId);

    if (conversationIds.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        id: { in: conversationIds },
      },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
            isRead: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Get all member user IDs across all conversations for a single query
    const allMemberIds = [
      ...new Set(conversations.flatMap((c) => c.members.map((m) => m.userId))),
    ];

    const users = await prisma.user.findMany({
      where: { id: { in: allMemberIds } },
      select: { id: true, firstname: true, lastname: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    // Count unread messages per conversation
    const unreadCounts = await Promise.all(
      conversationIds.map(async (convId) => {
        const count = await prisma.message.count({
          where: {
            conversationId: convId,
            isRead: false,
            senderId: { not: userId },
          },
        });
        return { convId, count };
      })
    );

    const unreadMap = new Map(unreadCounts.map((u) => [u.convId, u.count]));

    const result = conversations.map((conv) => {
      const lastMsg = conv.messages[0] ?? null;
      const members = conv.members
        .map((m) => userMap.get(m.userId))
        .filter(Boolean)
        .map((u) => ({
          id: u!.id,
          firstname: u!.firstname,
          lastname: u!.lastname,
        }));

      return {
        id: conv.id,
        type: conv.type,
        name: conv.name,
        lastMessage: lastMsg?.content ?? null,
        lastMessageAt: lastMsg?.createdAt ?? null,
        unreadCount: unreadMap.get(conv.id) ?? 0,
        members,
      };
    });

    return NextResponse.json({ conversations: result });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
