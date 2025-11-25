import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';
import { enforceRole } from '@/server/middlewares/enforce-role';

const taskSchema = z.object({
  organizationId: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedToId: z.string().optional(),
});

export const taskRouter = router({
  createTask: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify user is a member of the organization
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this organization' });
      }

      const task = await prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status || 'todo',
          priority: input.priority || 'medium',
          organizationId: input.organizationId,
          assignedToId: input.assignedToId,
          createdById: ctx.session.user.id,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return task;
    }),

  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        organizationId: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        assignedToId: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify task exists and user has access
      const task = await prisma.task.findUnique({
        where: { id: input.id },
      });

      if (!task) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      // Verify user is a member
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this organization' });
      }

      const updated = await prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          assignedToId: input.assignedToId ?? undefined,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updated;
    }),

  deleteTask: enforceRole(['OWNER', 'ADMIN'])
    .input(z.object({ id: z.string(), organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify task exists and belongs to the organization
      const task = await prisma.task.findUnique({
        where: { id: input.id },
      });

      if (!task) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      if (task.organizationId !== input.organizationId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Task does not belong to this organization' });
      }

      await prisma.task.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  listTasks: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify user is a member
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this organization' });
      }

      const tasks = await prisma.task.findMany({
        where: { organizationId: input.organizationId },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      return {
        tasks,
        nextCursor: tasks.length === input.limit ? tasks[tasks.length - 1]?.id : undefined,
      };
    }),

  getTask: protectedProcedure
    .input(z.object({ id: z.string(), organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await prisma.task.findUnique({
        where: { id: input.id },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }

      // Verify user is a member
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this organization' });
      }

      return task;
    }),
});
