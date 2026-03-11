import { NextRequest, NextResponse } from 'next/server';
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

/**
 * POST /api/admin/courses
 * Create a new course. Requires admin role.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      fullname,
      shortname,
      categoryId,
      visible = true,
      startdate,
      enddate,
      idnumber,
      summary,
      format = 'topics',
      numsections = 10,
      lang,
      maxbytes = 0,
      showactivitydates = true,
      enablecompletion = true,
      image,
    } = body;

    if (!fullname || typeof fullname !== 'string' || fullname.trim().length === 0) {
      return NextResponse.json({ error: 'Course full name is required' }, { status: 400 });
    }

    if (!shortname || typeof shortname !== 'string' || shortname.trim().length === 0) {
      return NextResponse.json({ error: 'Course short name is required' }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'Course category is required' }, { status: 400 });
    }

    // Check shortname uniqueness
    const existing = await prisma.course.findUnique({
      where: { shortname: shortname.trim() },
    });
    if (existing) {
      return NextResponse.json({ error: `Short name "${shortname.trim()}" is already in use` }, { status: 400 });
    }

    // Verify category exists
    const category = await prisma.courseCategory.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        fullname: fullname.trim(),
        shortname: shortname.trim(),
        categoryId,
        visible,
        startdate: startdate ? new Date(startdate) : new Date(),
        enddate: enddate ? new Date(enddate) : null,
        idnumber: idnumber?.trim() || null,
        summary: summary?.trim() || null,
        format,
        numsections,
        lang: lang || null,
        maxbytes,
        showactivitydates,
        enablecompletion,
        image: image || null,
      },
    });

    // Auto-enroll the creator as editing teacher
    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        role: 'editingteacher',
        status: 'active',
        enrolMethod: 'manual',
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
