'use client';

import React from 'react';
import { StatsCard, useDashboardStats } from '@/features/dashboard';

export function DashboardContent() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface-600 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-600 border border-border-300 rounded-xl p-6">
              <div className="h-4 w-24 bg-bg-800 rounded mb-4 animate-pulse" />
              <div className="h-8 w-16 bg-bg-800 rounded mb-2 animate-pulse" />
              <div className="h-3 w-32 bg-bg-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-100 mb-2">Dashboard</h1>
        <p className="text-muted-400">Overview of your workspace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats?.taskCount ?? 0}
          description="Across all organizations"
        />
        <StatsCard
          title="Team Members"
          value={stats?.memberCount ?? 0}
          description="Total members"
        />
        <StatsCard
          title="Organizations"
          value={stats?.organizationCount ?? 0}
          description="Your organizations"
        />
      </div>
    </div>
  );
}

