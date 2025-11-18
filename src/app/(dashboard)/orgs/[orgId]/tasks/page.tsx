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
    <div className="p-8">
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList organizationId={params.orgId} />
      </Suspense>
    </div>
  );
}
