import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';

export const dashboardRouter = router({
  getDashboardStats: protectedProcedure
    .input(z.object({ organizationId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (input.organizationId) {
        // Verify user is a member
        const membership = await prisma.organizationUser.findUnique({
          where: {
            organizationId_userId: {
              organizationId: input.organizationId,
              userId,
            },
          },
        });

        if (!membership) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        // Get stats for specific org
        const [taskCount, memberCount] = await Promise.all([
          prisma.task.count({
            where: { organizationId: input.organizationId },
          }),
          prisma.organizationUser.count({
            where: { organizationId: input.organizationId },
          }),
        ]);

        return {
          taskCount,
          memberCount,
          organizationCount: 1,
        };
      }

      // Get stats for all user's orgs
      const orgs = await prisma.organizationUser.findMany({
        where: { userId },
        include: { organization: true },
      });

      const orgIds = orgs.map((o) => o.organizationId);

      const [taskCount, memberCount] = await Promise.all([
        prisma.task.count({
          where: { organizationId: { in: orgIds } },
        }),
        prisma.organizationUser.count({
          where: { organizationId: { in: orgIds } },
        }),
      ]);

      return {
        taskCount,
        memberCount,
        organizationCount: orgs.length,
      };
    }),
});

