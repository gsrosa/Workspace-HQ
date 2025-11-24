"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../shared/validations";
import { TASK_STATUSES, TASK_PRIORITIES } from "../shared/constants";
import { useCreateTask, useUpdateTask } from "../hooks/use-task-mutations";
import type { Task } from "../shared/models";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  task?: Task;
  onSuccess?: () => void;
}

type TaskFormValues = {
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  assignedToId?: string;
};

export const TaskForm = ({
  open,
  onOpenChange,
  organizationId,
  task,
  onSuccess,
}: TaskFormProps) => {
  const isEditing = !!task;
  const createTask = useCreateTask(organizationId);
  const updateTask = useUpdateTask(organizationId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(
      isEditing
        ? updateTaskSchema.omit({ id: true, organizationId: true })
        : createTaskSchema
    ),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          status: task.status as "todo" | "in_progress" | "done",
          priority: task.priority as "low" | "medium" | "high",
        }
      : {
          status: "todo",
          priority: "medium",
        },
  });

  React.useEffect(() => {
    if (open && task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status as "todo" | "in_progress" | "done",
        priority: task.priority as "low" | "medium" | "high",
      });
    } else if (open && !task) {
      reset({
        status: "todo",
        priority: "medium",
      });
    }
  }, [open, task, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isEditing && task) {
        const updateData: UpdateTaskInput = {
          id: task.id,
          organizationId,
          ...data,
        };
        await updateTask.mutateAsync(updateData);
      } else {
        const createData: CreateTaskInput = {
          ...data,
        };
        await createTask.mutateAsync({
          organizationId,
          ...createData,
        });
      }
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      setError("root", { message: error.message || "Failed to save task" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update task details"
              : "Add a new task to your organization"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("title")}
            label="Title"
            placeholder="Task title"
            error={errors.title?.message}
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium text-text-100 mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-600 border border-border-300 text-text-100 placeholder:text-muted-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
              placeholder="Task description (optional)"
              rows={4}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-danger-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-100 mb-1.5">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-600 border border-border-300 text-text-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-100 mb-1.5">
                Priority
              </label>
              <select
                {...register("priority")}
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
          {errors.root && (
            <p className="text-sm text-danger-500" role="alert">
              {errors.root.message}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
