'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as Select from '@radix-ui/react-select';
import { useOrgs } from '../hooks/use-org';
import { cn } from '@/lib/utils';

export const OrgSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { orgs, isLoading } = useOrgs();

  // Extract current orgId from pathname
  const currentOrgId = pathname.match(/\/orgs\/([^/]+)/)?.[1];

  const handleOrgChange = (orgId: string) => {
    router.push(`/orgs/${orgId}/tasks`);
  };

  if (isLoading || orgs.length === 0) {
    return null;
  }

  const currentOrg = orgs.find((org) => org.id === currentOrgId) || orgs[0];

  return (
    <Select.Root value={currentOrg?.id} onValueChange={handleOrgChange}>
      <Select.Trigger
        className={cn(
          'inline-flex items-center justify-between',
          'px-3 py-2 rounded-lg',
          'bg-surface-600 border border-border-300',
          'text-text-100 text-sm font-medium',
          'focus:outline-none focus:ring-2 focus:ring-accent-500',
          'hover:bg-surface-600/80',
          'transition-colors',
          'min-w-[200px]'
        )}
      >
        <Select.Value placeholder="Select organization">
          {currentOrg?.name}
        </Select.Value>
        <Select.Icon className="ml-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={cn(
            'overflow-hidden rounded-lg',
            'bg-surface-600 border border-border-300',
            'shadow-soft',
            'z-50'
          )}
        >
          <Select.Viewport className="p-1">
            {orgs.map((org) => (
              <Select.Item
                key={org.id}
                value={org.id}
                className={cn(
                  'relative flex items-center',
                  'px-3 py-2 rounded-md',
                  'text-sm text-text-100',
                  'cursor-pointer',
                  'focus:outline-none focus:bg-accent-500/10',
                  'data-[highlighted]:bg-accent-500/10'
                )}
              >
                <Select.ItemText>{org.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

