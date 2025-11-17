'use client';

import React, { useRef, useState } from 'react';
import { useTasks } from '../hooks/use-task-query';
import { useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/use-task-mutations';
import { TaskForm } from './task-form';
import { VirtualizedTaskTable } from './virtualized-task-table';
import { TaskSkeleton } from './task-skeleton';
import { Button } from '@/components/ui/button';
import type { CreateTaskInput, UpdateTaskInput } from '../shared/validations';
import type { Task } from '../shared/models';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface TaskListProps {
  organizationId: string;
}

export const TaskList = ({ organizationId }: TaskListProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks(organizationId);
  const createTask = useCreateTask(organizationId);
  const updateTask = useUpdateTask(organizationId);
  const deleteTask = useDeleteTask(organizationId);

  const allTasks = data?.pages.flatMap((page) => page.items) || [];

  const handleCreate = async (input: CreateTaskInput) => {
    await createTask.mutateAsync({
      ...input,
      organizationId,
    });
  };

  const handleUpdate = async (input: UpdateTaskInput) => {
    await updateTask.mutateAsync({
      ...input,
      organizationId,
    });
  };

  const handleDelete = async () => {
    if (deletingTask) {
      await deleteTask.mutateAsync({
        id: deletingTask.id,
        organizationId,
      });
      setDeletingTask(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-100">Tasks</h1>
          <Button disabled>New Task</Button>
        </div>
        <div className="bg-surface-600 border border-border-300 rounded-xl overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-100">Tasks</h1>
        <Button onClick={() => setIsCreateOpen(true)}>New Task</Button>
      </div>

      <div className="bg-surface-600 border border-border-300 rounded-xl overflow-hidden">
        {allTasks.length === 0 ? (
          <div className="p-8 text-center text-muted-400">
            <p>No tasks yet. Create your first task to get started.</p>
          </div>
        ) : (
          <VirtualizedTaskTable
            tasks={allTasks}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(task) => setDeletingTask(task)}
            parentRef={parentRef}
          />
        )}
      </div>

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

      <TaskForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        organizationId={organizationId}
        onSubmit={handleCreate}
      />

      <TaskForm
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        organizationId={organizationId}
        task={editingTask ? {
          id: editingTask.id,
          title: editingTask.title,
          description: editingTask.description || undefined,
          status: editingTask.status as 'todo' | 'in_progress' | 'done',
          priority: editingTask.priority as 'low' | 'medium' | 'high',
          assignedToId: editingTask.assignedToId || undefined,
        } : undefined}
        onSubmit={handleUpdate}
      />

      <Dialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingTask?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setDeletingTask(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

