import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/announcements
 * Returns site news from forums with forumType='news'.
 * Includes discussions with post count (replies) and author info.
 */
export async function GET() {
  try {
    const newsForums = await prisma.forum.findMany({
      where: {
        forumType: 'news',
      },
      include: {
        module: {
          select: { courseId: true },
        },
        discussions: {
          include: {
            user: {
              select: { id: true, firstname: true, lastname: true },
            },
            posts: {
              select: { id: true, message: true },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const announcements = newsForums.flatMap((forum) =>
      forum.discussions.map((discussion) => {
        const firstPost = discussion.posts[0];
        const replies = Math.max(0, discussion.posts.length - 1);

        return {
          id: discussion.id,
          title: discussion.name,
          excerpt: discussion.posts[0]?.message || discussion.name,
          author: `${discussion.user.firstname} ${discussion.user.lastname}`,
          authorId: discussion.user.id,
          date: discussion.createdAt,
          replies,
          forumId: forum.id,
          discussionId: discussion.id,
          courseId: forum.module.courseId,
        };
      })
    );

    // Sort all announcements by date descending
    announcements.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
