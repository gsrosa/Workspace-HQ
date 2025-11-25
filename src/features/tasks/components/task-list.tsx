'use client';

import React from 'react';
import { useTasks } from '../hooks/use-task-query';
import { KanbanBoard } from './kanban-board';
import { TaskSkeleton, TaskListSkeleton } from './task-skeleton';
import { TaskForm } from './task-form';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/features/orgs';
import { useDeleteTask } from '../hooks/use-task-mutations';
import { Role } from '@prisma/client';
import type { Task } from '../shared/models';

interface TaskListProps {
  organizationId: string;
}

export const TaskList = ({ organizationId }: TaskListProps) => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks(organizationId);
  const { data: roleData } = useUserRole(organizationId);
  const deleteTask = useDeleteTask(organizationId);
  const userRole = roleData?.role;
  const canCreateOrDelete = userRole && userRole !== Role.MEMBER;

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

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setDeletingId(taskId);
    try {
      await deleteTask.mutateAsync({ id: taskId, organizationId });
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeletingId(null);
    }
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
        {canCreateOrDelete && <Button onClick={handleCreate}>New Task</Button>}
      </div>

      {allTasks.length === 0 ? (
        <div className="p-8 text-center border border-border-300 rounded-lg bg-surface-600">
          <p className="text-muted-400 mb-4">No tasks yet. Create your first task to get started.</p>
          {canCreateOrDelete && <Button onClick={handleCreate}>Create Task</Button>}
        </div>
      ) : (
        <>
          <KanbanBoard
            tasks={allTasks}
            organizationId={organizationId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
          {hasNextPage && (
            <div className="text-center mt-6">
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
