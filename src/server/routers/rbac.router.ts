import { z } from 'zod';
import { router, protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { enforceRole } from '../middlewares/enforceRole';
import { generateInviteToken, getInviteExpiry } from '@/lib/invite';
import { checkRateLimit } from '@/lib/rate-limit';
import { TRPCError } from '@trpc/server';
import { Role } from '@prisma/client';

export const rbacRouter = router({
  inviteUser: enforceRole([Role.OWNER, Role.ADMIN])
    .input(
      z.object({
        organizationId: z.string(),
        email: z.string().email(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limit: 10 invites per minute per user
      const rateLimitResult = await checkRateLimit(
        `invite-user:${ctx.session.user.id}`,
        10,
        '1m'
      );

      if (!rateLimitResult.success) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many invite requests. Please try again later.',
        });
      }
      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      // Create user if doesn't exist (without password - they'll set it on invite acceptance)
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: input.email,
            name: null,
          },
        });
      }

      // Check if already a member
      const existingMembership = await prisma.organizationUser.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: user.id,
          },
        },
      });

      if (existingMembership) {
        throw new Error('User is already a member of this organization');
      }

      // Generate invite token
      const token = generateInviteToken();
      const expiresAt = getInviteExpiry();

      // Create membership with invite token
      await prisma.organizationUser.create({
        data: {
          organizationId: input.organizationId,
          userId: user.id,
          role: input.role,
          inviteToken: token,
          inviteTokenExpires: expiresAt,
        },
      });

      return {
        token,
        expiresAt,
        email: input.email,
      };
    }),

  listUsers: protectedProcedure
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
        throw new Error('Not a member of this organization');
      }

      const members = await prisma.organizationUser.findMany({
        where: { organizationId: input.organizationId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return members;
    }),
});

