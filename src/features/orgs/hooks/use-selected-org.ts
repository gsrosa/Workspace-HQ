'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOrgs } from './use-org';

const SELECTED_ORG_QUERY_KEY = ['selected-org'];

export const useSelectedOrg = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { orgs, isLoading: orgsLoading } = useOrgs();

  // Get orgId from cookie (client-side)
  const getCookieOrgId = React.useCallback(() => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const orgCookie = cookies.find(c => c.trim().startsWith('workspace-hq-org-id='));
    return orgCookie ? orgCookie.split('=')[1] : null;
  }, []);

  // Query for selected org - sync with cookie
  const { data: selectedOrgId, isLoading: isLoadingSelectedOrg } = useQuery({
    queryKey: SELECTED_ORG_QUERY_KEY,
    queryFn: async () => {
      const cookieOrgId = getCookieOrgId();
      if (cookieOrgId && orgs.some((org: { id: string }) => org.id === cookieOrgId)) {
        return cookieOrgId;
      }
      // If no valid cookie, set first org as default
      if (orgs.length > 0 && !cookieOrgId) {
        const firstOrgId = orgs[0]?.id;
        if (firstOrgId) {
          // Set cookie via API (fire and forget)
          fetch('/api/org/select', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orgId: firstOrgId }),
          }).catch((error) => {
            console.error('Error setting default org cookie:', error);
          });
          return firstOrgId;
        }
      }
      return null;
    },
    enabled: !orgsLoading && orgs.length > 0,
    staleTime: 0, // Always check cookie
    refetchOnMount: true,
  });

  // Get the actual org object
  const selectedOrg = React.useMemo(() => {
    if (!selectedOrgId || !orgs.length) return null;
    return orgs.find((org: { id: string }) => org.id === selectedOrgId) || null;
  }, [selectedOrgId, orgs]);

  // Function to change selected org
  const setSelectedOrg = React.useCallback(
    async (orgId: string) => {
      // Verify org exists in user's orgs
      if (!orgs.some((org: { id: string }) => org.id === orgId)) {
        console.error('Organization not found in user organizations');
        return;
      }

      // Set cookie via API
      try {
        const response = await fetch('/api/org/select', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orgId }),
        });

        if (!response.ok) {
          throw new Error('Failed to set organization');
        }

        // Update React Query cache
        queryClient.setQueryData(SELECTED_ORG_QUERY_KEY, orgId);
        
        // Invalidate all queries to refetch data for new org
        queryClient.invalidateQueries();

        // Refresh the page to update server-side data
        router.refresh();
      } catch (error) {
        console.error('Error setting org cookie:', error);
        throw error;
      }
    },
    [orgs, queryClient, router]
  );

  return {
    selectedOrg,
    selectedOrgId: selectedOrgId || null,
    setSelectedOrg,
    isLoading: orgsLoading || isLoadingSelectedOrg,
  };
};

