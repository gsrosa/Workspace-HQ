import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';

const taskSchema = z.object({
  organizationId: z.string().min(1),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
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
          status: input.status,
          priority: input.priority,
          organizationId: input.organizationId,
          assignedToId: input.assignedToId,
        },
        include: {
          assignedTo: {
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
      taskSchema.extend({
        id: z.string(),
      }).partial().extend({ id: z.string(), organizationId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, organizationId, ...updateData } = input;

      // Verify user is a member
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      // Verify task belongs to organization
      const existingTask = await prisma.task.findUnique({
        where: { id },
      });

      if (!existingTask || existingTask.organizationId !== organizationId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const task = await prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          assignedTo: {
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

  deleteTask: protectedProcedure
    .input(z.object({
      id: z.string(),
      organizationId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
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
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      // Verify task belongs to organization
      const existingTask = await prisma.task.findUnique({
        where: { id: input.id },
      });

      if (!existingTask || existingTask.organizationId !== input.organizationId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await prisma.task.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  listTasks: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
      cursor: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
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
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const tasks = await prisma.task.findMany({
        where: { organizationId: input.organizationId },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (tasks.length > input.limit) {
        const nextItem = tasks.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: tasks,
        nextCursor,
      };
    }),

  getTask: protectedProcedure
    .input(z.object({
      id: z.string(),
      organizationId: z.string(),
    }))
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
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const task = await prisma.task.findFirst({
        where: {
          id: input.id,
          organizationId: input.organizationId,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return task;
    }),
});

