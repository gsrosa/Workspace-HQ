import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TaskSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border-300">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-20 rounded" />
      <Skeleton className="h-6 w-16 rounded" />
    </div>
  );
};

