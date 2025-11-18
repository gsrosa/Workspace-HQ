import { trpc } from '@/components/providers/trpc-provider';

export const useTasks = (organizationId: string) => {
  return trpc.task.listTasks.useInfiniteQuery(
    {
      organizationId,
      limit: 50,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
};

export const useTask = (id: string, organizationId: string) => {
  return trpc.task.getTask.useQuery({ id, organizationId });
};
