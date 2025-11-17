import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from '@/server/routers/_app';
import { prisma } from '@/lib/prisma';
import { createTRPCContext } from '@/lib/trpc';

describe('TDD-5: Simple invite link (temporary)', () => {
  let testUser: any;
  let testOrg: any;

  beforeEach(async () => {
    // Create test user and org
    testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashed',
        name: 'Test User',
      },
    });

    testOrg = await prisma.organization.create({
      data: {
        name: 'Test Org',
        members: {
          create: {
            userId: testUser.id,
            role: 'OWNER',
          },
        },
      },
    });
  });

  it('should generate invite token with email, orgId, role and expires <24h', async () => {
    const ctx = await createTRPCContext();
    // Mock session
    (ctx as any).session = { user: { id: testUser.id } };

    const caller = appRouter.createCaller(ctx as any);

    const result = await caller.rbac.inviteUser({
      organizationId: testOrg.id,
      email: 'invitee@example.com',
      role: 'MEMBER',
    });

    expect(result.token).toBeDefined();
    expect(result.token).toBeTruthy();
    expect(result.expiresAt).toBeInstanceOf(Date);
    
    const hoursUntilExpiry = (result.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60);
    expect(hoursUntilExpiry).toBeLessThan(24);
    expect(hoursUntilExpiry).toBeGreaterThan(23); // Should be close to 24h
  });

  it('should only allow OWNER/ADMIN to invite', async () => {
    // Create MEMBER user
    const memberUser = await prisma.user.create({
      data: {
        email: `member-${Date.now()}@example.com`,
        password: 'hashed',
        name: 'Member User',
      },
    });

    await prisma.organizationUser.create({
      data: {
        organizationId: testOrg.id,
        userId: memberUser.id,
        role: 'MEMBER',
      },
    });

    const ctx = await createTRPCContext();
    (ctx as any).session = { user: { id: memberUser.id } };

    const caller = appRouter.createCaller(ctx as any);

    await expect(
      caller.rbac.inviteUser({
        organizationId: testOrg.id,
        email: 'invitee@example.com',
        role: 'MEMBER',
      })
    ).rejects.toThrow();
  });
});

