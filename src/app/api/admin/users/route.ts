import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/users
 * Returns all users with enrollment counts for admin management.
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

    const users = await prisma.user.findMany({
      where: {
        deleted: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        confirmed: true,
        suspended: true,
        lastaccess: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      confirmed: user.confirmed,
      suspended: user.suspended,
      lastaccess: user.lastaccess ? user.lastaccess.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      enrollmentCount: user._count.enrollments,
    }));

    return NextResponse.json({ users: result });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users. The database may not be set up yet.' },
      { status: 500 }
    );
  }
}
