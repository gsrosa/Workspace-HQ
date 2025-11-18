import React, { Suspense } from 'react';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StatsCard, DashboardSkeleton } from '@/features/dashboard';

async function getDefaultOrg(userId: string) {
  const membership = await prisma.organizationUser.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: 'desc' },
  });
  return membership?.organization;
}

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  const defaultOrg = await getDefaultOrg(session.user.id);

  if (!defaultOrg) {
    redirect('/orgs/new');
  }

  // Get stats server-side
  const [totalTasks, todoTasks, inProgressTasks, doneTasks, totalMembers] = await Promise.all([
    prisma.task.count({ where: { organizationId: defaultOrg.id } }),
    prisma.task.count({ where: { organizationId: defaultOrg.id, status: 'todo' } }),
    prisma.task.count({ where: { organizationId: defaultOrg.id, status: 'in_progress' } }),
    prisma.task.count({ where: { organizationId: defaultOrg.id, status: 'done' } }),
    prisma.organizationUser.count({ where: { organizationId: defaultOrg.id } }),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-100">Dashboard</h1>
        <p className="text-muted-400 mt-2">Overview of {defaultOrg.name}</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            description="All tasks in this organization"
          />
          <StatsCard
            title="To Do"
            value={todoTasks}
            description="Tasks pending"
          />
          <StatsCard
            title="In Progress"
            value={inProgressTasks}
            description="Tasks being worked on"
          />
          <StatsCard
            title="Completed"
            value={doneTasks}
            description="Finished tasks"
          />
          <StatsCard
            title="Team Members"
            value={totalMembers}
            description="Organization members"
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </Suspense>
    </div>
  );
}
