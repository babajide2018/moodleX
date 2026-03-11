import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/courses/[courseId]/logs
 * Returns log entries for a course with filtering and pagination.
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

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, fullname: true, shortname: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '20', 10);
    const userId = searchParams.get('userId') || undefined;
    const action = searchParams.get('action') || undefined;
    const date = searchParams.get('date') || undefined;
    const search = searchParams.get('search') || undefined;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { courseId };

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);
      where.createdAt = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    if (search) {
      where.OR = [
        { description: { contains: search } },
        { component: { contains: search } },
        { target: { contains: search } },
        { eventName: { contains: search } },
      ];
    }

    // Get total count and logs
    const [total, logs] = await Promise.all([
      prisma.logStore.count({ where }),
      prisma.logStore.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: {
            select: { id: true, firstname: true, lastname: true, email: true },
          },
        },
      }),
    ]);

    // Get unique users and actions for filter dropdowns
    const [uniqueUsers, uniqueActions] = await Promise.all([
      prisma.logStore.findMany({
        where: { courseId },
        select: { userId: true, user: { select: { id: true, firstname: true, lastname: true } } },
        distinct: ['userId'],
      }),
      prisma.logStore.findMany({
        where: { courseId },
        select: { action: true },
        distinct: ['action'],
      }),
    ]);

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log.id,
        time: log.createdAt.toISOString(),
        user: `${log.user.firstname} ${log.user.lastname}`,
        userId: log.userId,
        eventName: log.eventName,
        action: log.action,
        target: log.target,
        component: log.component,
        description: log.description || '',
        ip: log.ip || '',
        contextLevel: log.contextLevel,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      filters: {
        users: uniqueUsers.map((u) => ({
          id: u.userId,
          name: `${u.user.firstname} ${u.user.lastname}`,
        })),
        actions: uniqueActions.map((a) => a.action),
      },
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
