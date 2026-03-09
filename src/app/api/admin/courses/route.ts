import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/courses
 * Returns all courses with category, student count, and section count for admin management.
 * Requires admin role.
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      include: {
        category: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            enrollments: true,
            sections: true,
          },
        },
      },
      orderBy: {
        fullname: 'asc',
      },
    });

    const result = courses.map((course) => ({
      id: course.id,
      fullname: course.fullname,
      shortname: course.shortname,
      category: course.category.name,
      categoryId: course.category.id,
      visible: course.visible,
      format: course.format,
      startdate: course.startdate.toISOString(),
      enddate: course.enddate ? course.enddate.toISOString() : null,
      studentCount: course._count.enrollments,
      sectionCount: course._count.sections,
      createdAt: course.createdAt.toISOString(),
    }));

    return NextResponse.json({ courses: result });
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
