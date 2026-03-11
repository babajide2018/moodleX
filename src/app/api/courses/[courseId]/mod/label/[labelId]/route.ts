import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; labelId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, labelId } = await params;

    const courseModule = await prisma.courseModule.findFirst({
      where: {
        id: labelId,
        courseId,
        moduleType: 'label',
      },
      include: {
        labelModule: true,
        section: {
          include: {
            course: {
              select: { id: true, shortname: true, fullname: true },
            },
          },
        },
      },
    });

    if (!courseModule) {
      return NextResponse.json({ error: 'Label module not found' }, { status: 404 });
    }

    return NextResponse.json(courseModule);
  } catch (error) {
    console.error('Error fetching label module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; labelId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, labelId } = await params;
    const body = await request.json();

    const existing = await prisma.courseModule.findFirst({
      where: { id: labelId, courseId, moduleType: 'label' },
      include: { labelModule: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Label module not found' }, { status: 404 });
    }

    const updatedModule = await prisma.courseModule.update({
      where: { id: labelId },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        visible: body.visible ?? existing.visible,
      },
    });

    if (existing.labelModule && body.content !== undefined) {
      await prisma.labelModule.update({
        where: { id: existing.labelModule.id },
        data: {
          content: body.content ?? existing.labelModule.content,
        },
      });
    }

    const result = await prisma.courseModule.findFirst({
      where: { id: labelId },
      include: {
        labelModule: true,
        section: {
          include: {
            course: {
              select: { id: true, shortname: true, fullname: true },
            },
          },
        },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating label module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
