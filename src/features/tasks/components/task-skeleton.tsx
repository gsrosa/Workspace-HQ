import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TaskSkeleton = () => {
  return (
    <div className="space-y-3 p-4 border-b border-border-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

export const TaskListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="divide-y divide-border-300">
      {Array.from({ length: count }).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </div>
  );
};
