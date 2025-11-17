import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from '@/server/routers/_app';
import { prisma } from '@/lib/prisma';
import { createTRPCContext } from '@/lib/trpc';

describe('TDD-10: Input validation', () => {
  let testUser: any;
  let testOrg: any;

  beforeEach(async () => {
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

  it('should reject empty title', async () => {
    const ctx = await createTRPCContext();
    (ctx as any).session = { user: { id: testUser.id } };

    const caller = appRouter.createCaller(ctx as any);

    await expect(
      caller.task.createTask({
        organizationId: testOrg.id,
        title: '',
        description: 'Test description',
      })
    ).rejects.toThrow();
  });

  it('should reject missing organizationId', async () => {
    const ctx = await createTRPCContext();
    (ctx as any).session = { user: { id: testUser.id } };

    const caller = appRouter.createCaller(ctx as any);

    await expect(
      caller.task.createTask({
        organizationId: '',
        title: 'Test Task',
        description: 'Test description',
      })
    ).rejects.toThrow();
  });

  it('should accept valid task data', async () => {
    const ctx = await createTRPCContext();
    (ctx as any).session = { user: { id: testUser.id } };

    const caller = appRouter.createCaller(ctx as any);

    const result = await caller.task.createTask({
      organizationId: testOrg.id,
      title: 'Valid Task',
      description: 'Valid description',
      status: 'todo',
      priority: 'medium',
    });

    expect(result).toBeDefined();
    expect(result.title).toBe('Valid Task');
    expect(result.organizationId).toBe(testOrg.id);
  });
});

