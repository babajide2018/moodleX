import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; sectionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, sectionId } = await params;

    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Validate section exists and belongs to course
    const section = await prisma.courseSection.findFirst({
      where: { id: sectionId, courseId },
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, moduleType, description } = body;

    if (!name || !moduleType) {
      return NextResponse.json(
        { error: 'Name and moduleType are required' },
        { status: 400 }
      );
    }

    // Determine next sortorder
    const lastModule = await prisma.courseModule.findFirst({
      where: { sectionId },
      orderBy: { sortorder: 'desc' },
    });

    const sortorder = lastModule ? lastModule.sortorder + 1 : 0;

    const courseModule = await prisma.courseModule.create({
      data: {
        courseId,
        sectionId,
        name,
        moduleType,
        description: description || null,
        sortorder,
        visible: true,
      },
    });

    return NextResponse.json({ module: courseModule }, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
