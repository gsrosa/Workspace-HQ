import { describe, it, expect, beforeEach } from 'vitest';
import { enforceRole } from '@/server/middlewares/enforceRole';
import { protectedProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

describe('TDD-6: RBAC enforcement on server', () => {
  let testUser: any;
  let testOrg: any;
  let ownerMembership: any;
  let memberMembership: any;

  beforeEach(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashed',
        name: 'Test User',
      },
    });

    const memberUser = await prisma.user.create({
      data: {
        email: `member-${Date.now()}@example.com`,
        password: 'hashed',
        name: 'Member User',
      },
    });

    testOrg = await prisma.organization.create({
      data: {
        name: 'Test Org',
        members: {
          create: [
            {
              userId: testUser.id,
              role: 'OWNER',
            },
            {
              userId: memberUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
      include: {
        members: true,
      },
    });

    ownerMembership = testOrg.members.find((m: any) => m.userId === testUser.id);
    memberMembership = testOrg.members.find((m: any) => m.userId === memberUser.id);
  });

  it('should allow OWNER to access OWNER-only endpoints', async () => {
    const procedure = enforceRole([Role.OWNER]);
    const ctx = {
      session: { user: { id: testUser.id } },
      prisma,
    };

    const result = await procedure.use(async ({ ctx, next }) => {
      return next({ ctx: { ...ctx, input: { organizationId: testOrg.id } } });
    })({
      ctx: ctx as any,
      type: 'mutation' as any,
      path: 'test',
      input: { organizationId: testOrg.id },
      rawInput: { organizationId: testOrg.id },
      next: async () => ({ success: true }),
    } as any);

    expect(result).toBeDefined();
  });

  it('should reject MEMBER from accessing OWNER-only endpoints', async () => {
    const procedure = enforceRole([Role.OWNER]);
    const ctx = {
      session: { user: { id: memberMembership.userId } },
      prisma,
    };

    await expect(
      procedure.use(async ({ ctx, next }) => {
        return next({ ctx: { ...ctx, input: { organizationId: testOrg.id } } });
      })({
        ctx: ctx as any,
        type: 'mutation' as any,
        path: 'test',
        input: { organizationId: testOrg.id },
        rawInput: { organizationId: testOrg.id },
        next: async () => ({ success: true }),
      } as any)
    ).rejects.toThrow('FORBIDDEN');
  });
});

