import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; urlId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, urlId } = await params;

    const courseModule = await prisma.courseModule.findFirst({
      where: {
        id: urlId,
        courseId,
        moduleType: 'url',
      },
      include: {
        urlModule: true,
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
      return NextResponse.json({ error: 'URL module not found' }, { status: 404 });
    }

    return NextResponse.json(courseModule);
  } catch (error) {
    console.error('Error fetching URL module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; urlId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, urlId } = await params;
    const body = await request.json();

    const existing = await prisma.courseModule.findFirst({
      where: { id: urlId, courseId, moduleType: 'url' },
      include: { urlModule: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'URL module not found' }, { status: 404 });
    }

    const updatedModule = await prisma.courseModule.update({
      where: { id: urlId },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        visible: body.visible ?? existing.visible,
      },
    });

    if (existing.urlModule && (body.externalUrl !== undefined || body.display !== undefined)) {
      await prisma.urlModule.update({
        where: { id: existing.urlModule.id },
        data: {
          externalUrl: body.externalUrl ?? existing.urlModule.externalUrl,
          display: body.display ?? existing.urlModule.display,
        },
      });
    }

    const result = await prisma.courseModule.findFirst({
      where: { id: urlId },
      include: {
        urlModule: true,
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
    console.error('Error updating URL module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
