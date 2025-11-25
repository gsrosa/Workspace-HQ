import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const orgRouter = router({
  createOrg: protectedProcedure
    .input(z.object({ name: z.string().min(1, 'Organization name is required') }))
    .mutation(async ({ ctx, input }) => {
      // Rate limit: 3 orgs per hour per user
      const rateLimitResult = await checkRateLimit(
        `create-org:${ctx.session.user.id}`,
        3,
        '1h'
      );

      if (!rateLimitResult.success) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many organization creation requests. Please try again later.',
        });
      }
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
    return memberships.map((m: { organization: any; role: any }) => ({
      ...m.organization,
      role: m.role,
    }));
  }),
});

