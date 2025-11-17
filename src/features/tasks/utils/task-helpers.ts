import type { Task } from '../shared/models';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'todo':
      return 'text-muted-400';
    case 'in_progress':
      return 'text-accent-500';
    case 'done':
      return 'text-success-500';
    default:
      return 'text-muted-400';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'low':
      return 'text-success-500';
    case 'medium':
      return 'text-muted-400';
    case 'high':
      return 'text-danger-500';
    default:
      return 'text-muted-400';
  }
};

export const formatTaskDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

