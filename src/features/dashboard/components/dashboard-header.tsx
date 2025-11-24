'use client';

import React from 'react';
import { useSelectedOrg } from '@/features/orgs';

export const DashboardHeader = () => {
  const { selectedOrg } = useSelectedOrg();

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-text-100">Dashboard</h1>
      <p className="text-muted-400 mt-2">
        {selectedOrg ? `Overview of ${selectedOrg.name}` : 'Get started by creating an organization'}
      </p>
    </div>
  );
};

