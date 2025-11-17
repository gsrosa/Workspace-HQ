import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';

export const orgRouter = router({
  createOrg: protectedProcedure
    .input(z.object({ name: z.string().min(1, 'Organization name is required') }))
    .mutation(async ({ ctx, input }) => {
      const org = await prisma.organization.create({
        data: {
          name: input.name,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: 'OWNER',
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
      return org;
    }),

  getOrg: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const membership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.orgId,
            userId: ctx.session.user.id,
          },
        },
        include: { organization: true },
      });

      if (!membership) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this organization' });
      }

      return membership.organization;
    }),

  listOrgsForUser: protectedProcedure.query(async ({ ctx }) => {
    const memberships = await prisma.organizationUser.findMany({
      where: { userId: ctx.session.user.id },
      include: { organization: true },
      orderBy: { createdAt: 'desc' },
    });
    return memberships.map((m) => m.organization);
  }),
});

