import React, { Suspense } from 'react';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TaskList } from '@/features/tasks';
import { TaskListSkeleton } from '@/features/tasks/components/task-skeleton';

export default async function TasksPage({
  params,
}: {
  params: { orgId: string };
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-100">Tasks</h1>
        <p className="text-muted-400 mt-2">Manage your organization's tasks</p>
      </div>
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList organizationId={params.orgId} />
      </Suspense>
    </div>
  );
}
