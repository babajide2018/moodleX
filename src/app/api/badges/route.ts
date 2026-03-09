import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/badges
 * Returns badges issued to the current user.
 * Auth required.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const badgesIssued = await prisma.badgeIssued.findMany({
      where: {
        userId: session.user.id,
        visible: true,
      },
      include: {
        badge: {
          include: {
            course: {
              select: { fullname: true },
            },
          },
        },
      },
      orderBy: {
        issuedOn: 'desc',
      },
    });

    const badges = badgesIssued.map((bi) => ({
      id: bi.badge.id,
      name: bi.badge.name,
      description: bi.badge.description,
      image: bi.badge.image,
      type: bi.badge.type,
      courseName: bi.badge.course?.fullname ?? null,
      issuedOn: bi.issuedOn,
    }));

    return NextResponse.json({ badges });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
