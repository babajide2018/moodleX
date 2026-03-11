import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * POST /api/courses/[courseId]/sections
 * Initialize default sections for a course (General + numbered topics).
 */
export async function POST(
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
      include: { _count: { select: { sections: true } } },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Don't recreate if sections already exist
    if (course._count.sections > 0) {
      return NextResponse.json({ message: 'Sections already exist' }, { status: 200 });
    }

    // Create General section (section 0) + numbered sections
    const sectionsToCreate = [
      { courseId, name: 'General', section: 0, visible: true },
    ];

    for (let i = 1; i <= course.numsections; i++) {
      sectionsToCreate.push({
        courseId,
        name: `Topic ${i}`,
        section: i,
        visible: true,
      });
    }

    await prisma.courseSection.createMany({
      data: sectionsToCreate,
    });

    // Fetch and return the created sections
    const sections = await prisma.courseSection.findMany({
      where: { courseId },
      orderBy: { section: 'asc' },
      include: { modules: { orderBy: { sortorder: 'asc' } } },
    });

    return NextResponse.json({
      sections: sections.map((s) => ({
        id: s.id,
        name: s.name,
        section: s.section,
        summary: s.summary || '',
        modules: [],
      })),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sections:', error);
    return NextResponse.json({ error: 'Failed to create sections' }, { status: 500 });
  }
}
