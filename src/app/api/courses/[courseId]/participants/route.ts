import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/courses/[courseId]/participants
 * Returns all users enrolled in the course with their roles.
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

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            lastaccess: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const participants = enrollments.map((enrollment) => ({
      id: enrollment.user.id,
      username: enrollment.user.username,
      firstname: enrollment.user.firstname,
      lastname: enrollment.user.lastname,
      email: enrollment.user.email,
      lastaccess: enrollment.user.lastaccess?.toISOString() || null,
      role: enrollment.role,
      status: enrollment.status,
      enrolMethod: enrollment.enrolMethod,
      enrolledAt: enrollment.createdAt.toISOString(),
    }));

    return NextResponse.json({ participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses/[courseId]/participants
 * Enrol a user in the course.
 * Body: { userId: string, roleId?: string }
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
    const body = await request.json();
    const { userId, roleId } = body as { userId: string; roleId?: string };

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstname: true, lastname: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'User is already enrolled in this course' },
        { status: 409 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        role: roleId || 'student',
        status: 'active',
        enrolMethod: 'manual',
        timestart: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            lastaccess: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        participant: {
          id: enrollment.user.id,
          username: enrollment.user.username,
          firstname: enrollment.user.firstname,
          lastname: enrollment.user.lastname,
          email: enrollment.user.email,
          lastaccess: enrollment.user.lastaccess?.toISOString() || null,
          role: enrollment.role,
          status: enrollment.status,
          enrolMethod: enrollment.enrolMethod,
          enrolledAt: enrollment.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error enrolling user:', error);
    return NextResponse.json(
      { error: 'Failed to enrol user' },
      { status: 500 }
    );
  }
}
