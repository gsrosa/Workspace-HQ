import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  className?: string;
}

export const StatsCard = ({ title, value, description, className }: StatsCardProps) => {
  return (
    <div
      className={cn(
        'bg-surface-600 border border-border-300 rounded-xl p-6',
        'hover:border-accent-500/50 transition-colors',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-400">{title}</p>
          <p className="text-3xl font-bold text-text-100 mt-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
