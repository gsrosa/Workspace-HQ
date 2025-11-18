import { trpc } from '@/components/providers/trpc-provider';
import type { CreateTaskInput, UpdateTaskInput } from '../shared/validations';

export const useCreateTask = (organizationId: string) => {
  const utils = trpc.useUtils();

  return trpc.task.createTask.useMutation({
    onMutate: async (newTask) => {
      // Cancel outgoing refetches
      await utils.task.listTasks.cancel({ organizationId });

      // Snapshot previous value
      const previous = utils.task.listTasks.getInfiniteData({ organizationId });

      // Optimistically update
      utils.task.listTasks.setInfiniteData({ organizationId }, (old) => {
        if (!old) return old;

        const optimisticTask = {
          id: `temp-${Date.now()}`,
          title: newTask.title,
          description: newTask.description || null,
          status: newTask.status || 'todo',
          priority: newTask.priority || 'medium',
          organizationId,
          assignedToId: newTask.assignedToId || null,
          assignedTo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return {
          ...old,
          pages: [
            {
              tasks: [optimisticTask],
              nextCursor: undefined,
            },
            ...old.pages,
          ],
        };
      });

      return { previous };
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      if (context?.previous) {
        utils.task.listTasks.setInfiniteData({ organizationId }, context.previous);
      }
    },
    onSettled: () => {
      utils.task.listTasks.invalidate({ organizationId });
    },
  });
};

export const useUpdateTask = (organizationId: string) => {
  const utils = trpc.useUtils();

  return trpc.task.updateTask.useMutation({
    onMutate: async (updatedTask) => {
      await utils.task.listTasks.cancel({ organizationId });
      const previous = utils.task.listTasks.getInfiniteData({ organizationId });

      utils.task.listTasks.setInfiniteData({ organizationId }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            tasks: page.tasks.map((task) =>
              task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            ),
          })),
        };
      });

      return { previous };
    },
    onError: (err, updatedTask, context) => {
      if (context?.previous) {
        utils.task.listTasks.setInfiniteData({ organizationId }, context.previous);
      }
    },
    onSettled: () => {
      utils.task.listTasks.invalidate({ organizationId });
    },
  });
};

export const useDeleteTask = (organizationId: string) => {
  const utils = trpc.useUtils();

  return trpc.task.deleteTask.useMutation({
    onMutate: async (deletedTask) => {
      await utils.task.listTasks.cancel({ organizationId });
      const previous = utils.task.listTasks.getInfiniteData({ organizationId });

      utils.task.listTasks.setInfiniteData({ organizationId }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            tasks: page.tasks.filter((task) => task.id !== deletedTask.id),
          })),
        };
      });

      return { previous };
    },
    onError: (err, deletedTask, context) => {
      if (context?.previous) {
        utils.task.listTasks.setInfiniteData({ organizationId }, context.previous);
      }
    },
    onSettled: () => {
      utils.task.listTasks.invalidate({ organizationId });
    },
  });
};
