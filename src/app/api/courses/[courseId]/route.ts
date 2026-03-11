import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/courses/[courseId]
 * Returns a single course with its sections and modules.
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

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: {
          select: { id: true, name: true },
        },
        sections: {
          orderBy: { section: 'asc' },
          include: {
            modules: {
              orderBy: { sortorder: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const result = {
      id: course.id,
      fullname: course.fullname,
      shortname: course.shortname,
      idnumber: course.idnumber,
      summary: course.summary,
      category: course.category.name,
      categoryId: course.category.id,
      format: course.format,
      numsections: course.numsections,
      visible: course.visible,
      startdate: course.startdate.toISOString(),
      enddate: course.enddate?.toISOString() || null,
      image: course.image,
      lang: course.lang,
      maxbytes: course.maxbytes,
      showgrades: course.showgrades,
      showreports: course.showreports,
      showactivitydates: course.showactivitydates,
      enablecompletion: course.enablecompletion,
      sections: course.sections.map((section) => ({
        id: section.id,
        name: section.name,
        section: section.section,
        summary: section.summary || '',
        modules: section.modules.map((mod) => ({
          id: mod.id,
          name: mod.name,
          moduleType: mod.moduleType,
          completion: 'none' as const,
        })),
      })),
    };

    return NextResponse.json({ course: result });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses/[courseId]
 * Update course settings.
 */
export async function PUT(
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
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, shortname: true },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check user has permission (admin, coursecreator, or editingteacher enrolled in the course)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = user.role === 'admin' || user.role === 'coursecreator';

    if (!isAdmin) {
      // Check if user is an editing teacher in this course
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        select: { role: true },
      });

      if (!enrollment || enrollment.role !== 'editingteacher') {
        return NextResponse.json(
          { error: 'You do not have permission to edit this course' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();

    const {
      fullname,
      shortname,
      idnumber,
      categoryId,
      visible,
      startdate,
      enddate,
      summary,
      format,
      numsections,
      showactivitydates,
      enablecompletion,
      lang,
      maxbytes,
      showgrades,
      showreports,
    } = body;

    // Validate shortname uniqueness (excluding current course)
    if (shortname && shortname !== existingCourse.shortname) {
      const duplicate = await prisma.course.findUnique({
        where: { shortname },
        select: { id: true },
      });

      if (duplicate && duplicate.id !== courseId) {
        return NextResponse.json(
          { error: 'A course with this short name already exists' },
          { status: 400 }
        );
      }
    }

    // Validate category exists if provided
    if (categoryId) {
      const category = await prisma.courseCategory.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Selected category does not exist' },
          { status: 400 }
        );
      }
    }

    // Build update data - only include fields that were provided
    const updateData: Record<string, unknown> = {};

    if (fullname !== undefined) updateData.fullname = fullname;
    if (shortname !== undefined) updateData.shortname = shortname;
    if (idnumber !== undefined) updateData.idnumber = idnumber || null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (visible !== undefined) updateData.visible = Boolean(visible);
    if (startdate !== undefined) updateData.startdate = new Date(startdate);
    if (enddate !== undefined) updateData.enddate = enddate ? new Date(enddate) : null;
    if (summary !== undefined) updateData.summary = summary || null;
    if (format !== undefined) updateData.format = format;
    if (numsections !== undefined) updateData.numsections = Number(numsections);
    if (showactivitydates !== undefined) updateData.showactivitydates = Boolean(showactivitydates);
    if (enablecompletion !== undefined) updateData.enablecompletion = Boolean(enablecompletion);
    if (lang !== undefined) updateData.lang = lang || null;
    if (maxbytes !== undefined) updateData.maxbytes = Number(maxbytes);
    if (showgrades !== undefined) updateData.showgrades = Boolean(showgrades);
    if (showreports !== undefined) updateData.showreports = Boolean(showreports);

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      data: updateData,
    });

    return NextResponse.json({
      course: {
        id: updatedCourse.id,
        fullname: updatedCourse.fullname,
        shortname: updatedCourse.shortname,
        idnumber: updatedCourse.idnumber,
        summary: updatedCourse.summary,
        category: updatedCourse.category.name,
        categoryId: updatedCourse.category.id,
        format: updatedCourse.format,
        numsections: updatedCourse.numsections,
        visible: updatedCourse.visible,
        startdate: updatedCourse.startdate.toISOString(),
        enddate: updatedCourse.enddate?.toISOString() || null,
        image: updatedCourse.image,
        lang: updatedCourse.lang,
        maxbytes: updatedCourse.maxbytes,
        showgrades: updatedCourse.showgrades,
        showreports: updatedCourse.showreports,
        showactivitydates: updatedCourse.showactivitydates,
        enablecompletion: updatedCourse.enablecompletion,
      },
      message: 'Course updated successfully',
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}
