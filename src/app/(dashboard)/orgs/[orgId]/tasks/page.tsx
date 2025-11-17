import React, { Suspense } from 'react';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TaskList } from '@/features/tasks';
import { TaskSkeleton } from '@/features/tasks';

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
      <Suspense fallback={
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text-100">Tasks</h1>
          </div>
          <div className="bg-surface-600 border border-border-300 rounded-xl overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <TaskList organizationId={params.orgId} />
      </Suspense>
    </div>
  );
}
