import { TRPCError } from '@trpc/server';
import { Role } from '@prisma/client';
import { protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';

export const enforceRole = (allowedRoles: Role[]) => {
  return protectedProcedure.use(async ({ ctx, next, input }) => {
    const { organizationId } = input as { organizationId: string };
    const userId = ctx.session.user.id;

    const membership = await prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this organization' });
    }

    if (!allowedRoles.includes(membership.role)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }

    return next({
      ctx: {
        ...ctx,
        membership,
      },
    });
  });
};

