'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTaskSchema, updateTaskSchema, type CreateTaskInput, type UpdateTaskInput } from '../shared/validations';
import { TASK_STATUSES, TASK_PRIORITIES } from '../shared/constants';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  task?: UpdateTaskInput;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
}

export const TaskForm = ({ open, onOpenChange, organizationId, task, onSubmit }: TaskFormProps) => {
  const isEditing = !!task;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateTaskInput | UpdateTaskInput>({
    resolver: zodResolver(isEditing ? updateTaskSchema : createTaskSchema),
    defaultValues: task || {
      status: 'todo',
      priority: 'medium',
    },
  });

  React.useEffect(() => {
    if (task) {
      setValue('id', task.id);
      setValue('title', task.title || '');
      setValue('description', task.description || '');
      setValue('status', task.status || 'todo');
      setValue('priority', task.priority || 'medium');
      setValue('assignedToId', task.assignedToId);
    } else {
      reset();
    }
  }, [task, setValue, reset]);

  const handleFormSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update task details' : 'Add a new task to your organization'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            {...register('title')}
            label="Title"
            type="text"
            placeholder="Task title"
            error={errors.title?.message}
          />
          <div>
            <label className="block text-sm font-medium text-text-100 mb-1.5">Description</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-600 border border-border-300 text-text-100 placeholder:text-muted-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
              placeholder="Task description"
              rows={3}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-danger-500">{errors.description.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-100 mb-1.5">Status</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-600 border border-border-300 text-text-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-100 mb-1.5">Priority</label>
              <select
                {...register('priority')}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-600 border border-border-300 text-text-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

