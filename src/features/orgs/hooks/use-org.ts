import { trpc } from '@/components/providers/trpc-provider';

export const useOrgs = () => {
  const { data: orgs, isLoading, error } = trpc.org.listOrgsForUser.useQuery();

  return {
    orgs: orgs ?? [],
    isLoading,
    error,
  };
};

export const useCreateOrg = () => {
  const utils = trpc.useUtils();

  return trpc.org.createOrg.useMutation({
    onSuccess: () => {
      utils.org.listOrgsForUser.invalidate();
    },
  });
};

