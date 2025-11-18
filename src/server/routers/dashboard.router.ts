import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';

export const dashboardRouter = router({
  getDashboardStats: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
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

      // Get simple counts
      const [totalTasks, todoTasks, inProgressTasks, doneTasks, totalMembers] = await Promise.all([
        prisma.task.count({ where: { organizationId: input.organizationId } }),
        prisma.task.count({ where: { organizationId: input.organizationId, status: 'todo' } }),
        prisma.task.count({ where: { organizationId: input.organizationId, status: 'in_progress' } }),
        prisma.task.count({ where: { organizationId: input.organizationId, status: 'done' } }),
        prisma.organizationUser.count({ where: { organizationId: input.organizationId } }),
      ]);

      return {
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        totalMembers,
      };
    }),
});
