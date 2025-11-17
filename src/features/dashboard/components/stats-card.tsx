import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard = ({ title, value, description, icon, className }: StatsCardProps) => {
  return (
    <div
      className={cn(
        'bg-surface-600 border border-border-300 rounded-xl p-6',
        'hover:border-accent-500/50 transition-colors',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-400">{title}</h3>
        {icon && <div className="text-accent-500">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-text-100 mb-1">{value}</div>
      {description && <p className="text-xs text-muted-400">{description}</p>}
    </div>
  );
};

