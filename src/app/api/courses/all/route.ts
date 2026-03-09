import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/courses/all
 * Returns all visible courses with category, teacher names, and student count.
 * No auth required (public site home page).
 */
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        visible: true,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
        enrollments: {
          select: {
            role: true,
            user: {
              select: { id: true, firstname: true, lastname: true },
            },
          },
        },
      },
      orderBy: {
        fullname: 'asc',
      },
    });

    const result = courses.map((course) => {
      const teachers = course.enrollments
        .filter((e) => e.role === 'editingteacher' || e.role === 'teacher')
        .map((e) => `${e.user.firstname} ${e.user.lastname}`);

      const studentCount = course.enrollments.filter(
        (e) => e.role === 'student'
      ).length;

      return {
        id: course.id,
        fullname: course.fullname,
        shortname: course.shortname,
        summary: course.summary,
        category: course.category.name,
        image: course.image,
        teachers,
        studentCount,
      };
    });

    return NextResponse.json({ courses: result });
  } catch (error) {
    console.error('Error fetching all courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
