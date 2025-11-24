import { trpc } from '@/components/providers/trpc-provider';
import type { UseQueryOptions } from '@tanstack/react-query';

export const useDashboardStats = (
  organizationId: string,
  options?: Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'>
) => {
  return trpc.dashboard.getDashboardStats.useQuery(
    { organizationId },
    {
      enabled: !!organizationId,
      staleTime: 0, // Always refetch when org changes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      ...options,
    }
  );
};
