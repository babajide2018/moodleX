import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/stats
 * Returns site statistics: user count, course count, enrollment count,
 * forum post count, badges issued, event count. No auth required.
 */
export async function GET() {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalForumPosts,
      totalBadgesIssued,
      totalEvents,
    ] = await Promise.all([
      prisma.user.count({
        where: { deleted: false },
      }),
      prisma.course.count({
        where: { visible: true },
      }),
      prisma.enrollment.count({
        where: { status: 'active' },
      }),
      prisma.forumPost.count(),
      prisma.badgeIssued.count(),
      prisma.calendarEvent.count({
        where: { visible: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalForumPosts,
        totalBadgesIssued,
        totalEvents,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
