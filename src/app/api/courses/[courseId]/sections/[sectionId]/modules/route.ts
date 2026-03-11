import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { logEvent } from '@/lib/logger';

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

    // Create CourseModule + type-specific record in a transaction
    const courseModule = await prisma.$transaction(async (tx) => {
      const mod = await tx.courseModule.create({
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

      switch (moduleType) {
        case 'assign': {
          await tx.assignment.create({
            data: {
              moduleId: mod.id,
              duedate: body.duedate ? new Date(body.duedate) : null,
              cutoffdate: body.cutoffdate ? new Date(body.cutoffdate) : null,
              allowsubmissionsfromdate: body.allowsubmissionsfromdate ? new Date(body.allowsubmissionsfromdate) : null,
              gradingType: body.gradingType || 'point',
              maxGrade: body.maxGrade ? parseFloat(body.maxGrade) : 100,
              submissionTypes: body.submissionTypes || 'onlinetext,file',
              maxFileSubmissions: body.maxFileSubmissions ? parseInt(body.maxFileSubmissions) : 1,
              allowLateSubmissions: body.allowLateSubmissions ?? false,
            },
          });
          await tx.gradeItem.create({
            data: {
              courseId, itemName: name, itemType: 'mod', itemModule: 'assign',
              gradeType: 'value', gradeMax: body.maxGrade ? parseFloat(body.maxGrade) : 100,
              gradeMin: 0, gradePass: 0, sortorder,
            },
          });
          break;
        }
        case 'quiz': {
          await tx.quiz.create({
            data: {
              moduleId: mod.id,
              timeopen: body.timeopen ? new Date(body.timeopen) : null,
              timeclose: body.timeclose ? new Date(body.timeclose) : null,
              timelimit: body.timelimit ? parseInt(body.timelimit) : null,
              attempts: body.attempts ? parseInt(body.attempts) : 0,
              grademethod: body.grademethod || 'highest',
              maxGrade: body.maxGrade ? parseFloat(body.maxGrade) : 100,
              shuffleQuestions: body.shuffleQuestions ?? false,
              shuffleAnswers: body.shuffleAnswers ?? true,
            },
          });
          await tx.gradeItem.create({
            data: {
              courseId, itemName: name, itemType: 'mod', itemModule: 'quiz',
              gradeType: 'value', gradeMax: body.maxGrade ? parseFloat(body.maxGrade) : 100,
              gradeMin: 0, gradePass: 0, sortorder,
            },
          });
          break;
        }
        case 'forum': {
          await tx.forum.create({
            data: {
              moduleId: mod.id,
              forumType: body.forumType || 'general',
              maxbytes: body.maxbytes ? parseInt(body.maxbytes) : 0,
              maxattachments: body.maxattachments ? parseInt(body.maxattachments) : 1,
              trackingtype: body.trackingtype || 'optional',
            },
          });
          break;
        }
        case 'resource': {
          await tx.resource.create({
            data: {
              moduleId: mod.id,
              fileId: body.fileId || null,
              display: body.display || 'automatic',
            },
          });
          break;
        }
        case 'url': {
          await tx.urlModule.create({
            data: {
              moduleId: mod.id,
              externalUrl: body.externalUrl || '',
              display: body.display || 'automatic',
            },
          });
          break;
        }
        case 'page': {
          await tx.pageModule.create({
            data: {
              moduleId: mod.id,
              content: body.content || '',
              display: body.display || 'automatic',
            },
          });
          break;
        }
        case 'label': {
          await tx.labelModule.create({
            data: {
              moduleId: mod.id,
              content: body.content || description || '',
            },
          });
          break;
        }
        case 'book': {
          await tx.pageModule.create({
            data: {
              moduleId: mod.id,
              content: body.content || '',
              display: 'automatic',
            },
          });
          break;
        }
      }

      return mod;
    });

    // Log module creation
    logEvent({
      eventName: 'course_module_created',
      component: `mod_${moduleType}`,
      action: 'created',
      target: 'course_module',
      objectTable: 'course_module',
      objectId: courseModule.id,
      courseId,
      userId: session.user.id,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      description: `The user created a ${moduleType} activity '${name}'.`,
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
