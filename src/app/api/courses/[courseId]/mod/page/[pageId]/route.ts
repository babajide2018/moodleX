import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; pageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, pageId } = await params;

    const courseModule = await prisma.courseModule.findFirst({
      where: {
        id: pageId,
        courseId,
        moduleType: 'page',
      },
      include: {
        pageModule: true,
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
      return NextResponse.json({ error: 'Page module not found' }, { status: 404 });
    }

    return NextResponse.json(courseModule);
  } catch (error) {
    console.error('Error fetching page module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; pageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, pageId } = await params;
    const body = await request.json();

    // Verify the module exists and belongs to this course
    const existing = await prisma.courseModule.findFirst({
      where: { id: pageId, courseId, moduleType: 'page' },
      include: { pageModule: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Page module not found' }, { status: 404 });
    }

    // Update the course module fields
    const updatedModule = await prisma.courseModule.update({
      where: { id: pageId },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        visible: body.visible ?? existing.visible,
      },
    });

    // Update the page-specific fields
    if (existing.pageModule && (body.content !== undefined || body.display !== undefined)) {
      await prisma.pageModule.update({
        where: { id: existing.pageModule.id },
        data: {
          content: body.content ?? existing.pageModule.content,
          display: body.display ?? existing.pageModule.display,
        },
      });
    }

    const result = await prisma.courseModule.findFirst({
      where: { id: pageId },
      include: {
        pageModule: true,
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
    console.error('Error updating page module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
