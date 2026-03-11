import prisma from '@/lib/db';

interface LogParams {
  eventName: string;
  component: string;
  action: string;
  target: string;
  objectTable?: string;
  objectId?: string;
  courseId?: string;
  userId: string;
  relatedUserId?: string;
  contextLevel?: string;
  ip?: string;
  description?: string;
  origin?: string;
}

/**
 * Log an event to the standard log store.
 * Fire-and-forget — errors are silently caught so logging never blocks operations.
 */
export async function logEvent(params: LogParams): Promise<void> {
  try {
    await prisma.logStore.create({
      data: {
        eventName: params.eventName,
        component: params.component,
        action: params.action,
        target: params.target,
        objectTable: params.objectTable ?? null,
        objectId: params.objectId ?? null,
        courseId: params.courseId ?? null,
        userId: params.userId,
        relatedUserId: params.relatedUserId ?? null,
        contextLevel: params.contextLevel ?? 'course',
        ip: params.ip ?? null,
        description: params.description ?? null,
        origin: params.origin ?? 'web',
      },
    });
  } catch {
    // Logging should never break the app
  }
}
