import { trpc } from '@/components/providers/trpc-provider';

export const useDashboardStats = (organizationId: string) => {
  return trpc.dashboard.getDashboardStats.useQuery(
    { organizationId },
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: false,
    }
  );
};
