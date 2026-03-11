import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/courses/[courseId]/reports
 * Returns course activity summary stats for the reports dashboard.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        fullname: true,
        shortname: true,
        startdate: true,
        enddate: true,
        enablecompletion: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Gather stats in parallel
    const [enrollmentCount, sectionCount, moduleCount, gradeItemCount, completionStats] =
      await Promise.all([
        prisma.enrollment.count({
          where: { courseId, status: 'active' },
        }),
        prisma.courseSection.count({
          where: { courseId },
        }),
        prisma.courseModule.count({
          where: { courseId },
        }),
        prisma.gradeItem.count({
          where: { courseId },
        }),
        prisma.moduleCompletion.findMany({
          where: {
            module: { courseId },
          },
          select: {
            state: true,
          },
        }),
      ]);

    const completedCount = completionStats.filter(
      (c) => c.state === 'complete' || c.state === 'complete_pass'
    ).length;
    const totalCompletionRecords = completionStats.length;

    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEnrollments = await prisma.enrollment.count({
      where: {
        courseId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Get module type breakdown
    const modules = await prisma.courseModule.findMany({
      where: { courseId },
      select: { moduleType: true },
    });

    const moduleTypes: Record<string, number> = {};
    for (const mod of modules) {
      moduleTypes[mod.moduleType] = (moduleTypes[mod.moduleType] || 0) + 1;
    }

    return NextResponse.json({
      stats: {
        courseId: course.id,
        courseName: course.fullname,
        courseShortname: course.shortname,
        enrollments: enrollmentCount,
        recentEnrollments,
        sections: sectionCount,
        modules: moduleCount,
        moduleTypes,
        gradeItems: gradeItemCount,
        completionRecords: totalCompletionRecords,
        completedActivities: completedCount,
        completionRate:
          totalCompletionRecords > 0
            ? Math.round((completedCount / totalCompletionRecords) * 100)
            : 0,
        startdate: course.startdate.toISOString(),
        enddate: course.enddate?.toISOString() || null,
        enablecompletion: course.enablecompletion,
      },
    });
  } catch (error) {
    console.error('Error fetching course reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course reports' },
      { status: 500 }
    );
  }
}
