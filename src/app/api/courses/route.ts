import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/courses
 * Returns the courses the authenticated user is enrolled in.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      include: {
        course: {
          include: {
            category: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const courses = enrollments.map((enrollment) => ({
      id: enrollment.course.id,
      fullname: enrollment.course.fullname,
      shortname: enrollment.course.shortname,
      category: enrollment.course.category.name,
      image: enrollment.course.image,
      visible: enrollment.course.visible,
      role: enrollment.role,
      startdate: enrollment.course.startdate,
      enddate: enrollment.course.enddate,
    }));

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
