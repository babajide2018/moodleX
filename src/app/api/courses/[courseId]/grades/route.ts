import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/courses/[courseId]/grades
 * Returns gradebook data for the course: grade items, grades per student, and enrolled participants.
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

    // Verify the course exists and get basic info
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        fullname: true,
        shortname: true,
        showgrades: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all grade items for this course, ordered by sortorder
    const gradeItems = await prisma.gradeItem.findMany({
      where: { courseId },
      include: {
        grades: {
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { sortorder: 'asc' },
    });

    // Get enrolled users (participants) for the course
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const participants = enrollments.map((enrollment) => ({
      id: enrollment.user.id,
      firstname: enrollment.user.firstname,
      lastname: enrollment.user.lastname,
      email: enrollment.user.email,
      role: enrollment.role,
    }));

    // Calculate course total for each participant
    // Sum of finalgrade across all non-course, non-category grade items
    const activityItems = gradeItems.filter(
      (item) => item.itemType !== 'course' && item.itemType !== 'category'
    );

    const courseTotals: Record<string, { earned: number; max: number }> = {};

    for (const participant of participants) {
      let totalEarned = 0;
      let totalMax = 0;

      for (const item of activityItems) {
        const grade = item.grades.find((g) => g.userId === participant.id);
        if (grade && grade.finalgrade !== null) {
          totalEarned += grade.finalgrade;
          totalMax += item.gradeMax;
        }
      }

      courseTotals[participant.id] = { earned: totalEarned, max: totalMax };
    }

    // Serialize grade items for the response
    const serializedGradeItems = gradeItems.map((item) => ({
      id: item.id,
      itemName: item.itemName,
      itemType: item.itemType,
      itemModule: item.itemModule,
      gradeMax: item.gradeMax,
      gradeMin: item.gradeMin,
      gradePass: item.gradePass,
      sortorder: item.sortorder,
      hidden: item.hidden,
      locked: item.locked,
      grades: item.grades.map((grade) => ({
        id: grade.id,
        userId: grade.userId,
        rawgrade: grade.rawgrade,
        finalgrade: grade.finalgrade,
        feedback: grade.feedback,
        overridden: grade.overridden,
        excluded: grade.excluded,
        user: grade.user,
      })),
    }));

    return NextResponse.json({
      course: {
        id: course.id,
        fullname: course.fullname,
        shortname: course.shortname,
      },
      gradeItems: serializedGradeItems,
      participants,
      courseTotals,
    });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}
