import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/categories
 * Returns all course categories in a flat list with hierarchy info.
 */
export async function GET() {
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

    const categories = await prisma.courseCategory.findMany({
      include: {
        _count: {
          select: { courses: true, children: true },
        },
      },
      orderBy: [{ sortorder: 'asc' }, { name: 'asc' }],
    });

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      idnumber: cat.idnumber,
      description: cat.description,
      parentId: cat.parentId,
      sortorder: cat.sortorder,
      visible: cat.visible,
      depth: cat.depth,
      path: cat.path,
      courseCount: cat._count.courses,
      childCount: cat._count.children,
      createdAt: cat.createdAt.toISOString(),
    }));

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Create a new course category.
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
    const { name, parentId, idnumber, description } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Determine depth and path based on parent
    let depth = 0;
    let parentPath = '/';
    if (parentId) {
      const parent = await prisma.courseCategory.findUnique({
        where: { id: parentId },
        select: { depth: true, path: true },
      });
      if (!parent) {
        return NextResponse.json({ error: 'Parent category not found' }, { status: 400 });
      }
      depth = parent.depth + 1;
      parentPath = parent.path;
    }

    // Get next sortorder
    const maxSort = await prisma.courseCategory.aggregate({
      _max: { sortorder: true },
      where: { parentId: parentId || null },
    });
    const sortorder = (maxSort._max.sortorder ?? 0) + 1;

    const category = await prisma.courseCategory.create({
      data: {
        name: name.trim(),
        idnumber: idnumber?.trim() || null,
        description: description?.trim() || null,
        parentId: parentId || null,
        depth,
        sortorder,
        path: '/', // Will update after creation
      },
    });

    // Update path to include own ID
    const updatedCategory = await prisma.courseCategory.update({
      where: { id: category.id },
      data: {
        path: parentPath === '/' ? `/${category.id}/` : `${parentPath}${category.id}/`,
      },
    });

    return NextResponse.json({ category: updatedCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
