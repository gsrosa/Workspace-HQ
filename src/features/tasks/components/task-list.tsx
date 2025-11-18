'use client';

import React from 'react';
import { useTasks } from '../hooks/use-task-query';
import { VirtualizedTaskTable } from './virtualized-task-table';
import { TaskSkeleton, TaskListSkeleton } from './task-skeleton';
import { TaskForm } from './task-form';
import { Button } from '@/components/ui/button';
import type { Task } from '../shared/models';

interface TaskListProps {
  organizationId: string;
}

export const TaskList = ({ organizationId }: TaskListProps) => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks(organizationId);

  const allTasks = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.tasks) ?? [];
  }, [data]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-danger-500">Failed to load tasks. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-100">Tasks</h2>
        <Button onClick={handleCreate}>New Task</Button>
      </div>

      {allTasks.length === 0 ? (
        <div className="p-8 text-center border border-border-300 rounded-lg bg-surface-600">
          <p className="text-muted-400 mb-4">No tasks yet. Create your first task to get started.</p>
          <Button onClick={handleCreate}>Create Task</Button>
        </div>
      ) : (
        <>
          <VirtualizedTaskTable
            tasks={allTasks}
            organizationId={organizationId}
            onEdit={handleEdit}
            containerRef={containerRef}
          />
          {hasNextPage && (
            <div className="text-center">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        organizationId={organizationId}
        task={editingTask}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
