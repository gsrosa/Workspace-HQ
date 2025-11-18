import type { Task } from '../shared/models';

export const getTaskStatusColor = (status: Task['status']) => {
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

export const getTaskPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'low':
      return 'text-muted-400';
    case 'medium':
      return 'text-accent-500';
    case 'high':
      return 'text-danger-500';
    default:
      return 'text-muted-400';
  }
};
