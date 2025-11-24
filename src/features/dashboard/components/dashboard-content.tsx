'use client';

import React from 'react';
import { StatsCard, TaskStatusChart } from '@/features/dashboard';
import { useDashboardStats } from '@/features/dashboard/hooks/use-dashboard-stats';
import { useSelectedOrg } from '@/features/orgs';

export const DashboardContent = () => {
  const { selectedOrgId, isLoading: isLoadingOrg } = useSelectedOrg();
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats(selectedOrgId || '', {
    enabled: !!selectedOrgId,
  });

  if (isLoadingOrg) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-600 border border-border-300 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-surface-500 rounded w-24 mb-4"></div>
              <div className="h-8 bg-surface-500 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedOrgId) {
    return (
      <div className="mb-6 bg-surface-600 border border-border-300 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-100 mb-2">No organization yet</h2>
            <p className="text-muted-400">
              Create your first organization to start managing tasks and collaborating with your team.
            </p>
          </div>
          <a
            href="/orgs/new"
            className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-400 transition-colors font-medium"
          >
            Create Organization
          </a>
        </div>
      </div>
    );
  }

  if (isLoadingStats || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-600 border border-border-300 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-surface-500 rounded w-24 mb-4"></div>
              <div className="h-8 bg-surface-500 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          description="All tasks in this organization"
        />
        <StatsCard
          title="To Do"
          value={stats.todoTasks}
          description="Tasks pending"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgressTasks}
          description="Tasks being worked on"
        />
        <StatsCard
          title="Completed"
          value={stats.doneTasks}
          description="Finished tasks"
        />
        <StatsCard
          title="Team Members"
          value={stats.totalMembers}
          description="Organization members"
          className="md:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Task Status Charts */}
      <TaskStatusChart
        todo={stats.todoTasks}
        inProgress={stats.inProgressTasks}
        done={stats.doneTasks}
      />
    </div>
  );
};

