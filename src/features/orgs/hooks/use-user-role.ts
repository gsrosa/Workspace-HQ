import { trpc } from '@/components/providers/trpc-provider';
import type { UseQueryOptions } from '@tanstack/react-query';

export const useUserRole = (
  organizationId: string | null | undefined,
  options?: Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'>
) => {
  return trpc.rbac.getUserRole.useQuery(
    { organizationId: organizationId! },
    {
      enabled: !!organizationId,
      ...options,
    }
  );
};

