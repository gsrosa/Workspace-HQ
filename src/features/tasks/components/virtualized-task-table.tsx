'use client';

import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Task } from '../shared/models';
import { getTaskStatusColor, getTaskPriorityColor } from '../utils/task-helpers';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '../hooks/use-task-mutations';

interface VirtualizedTaskTableProps {
  tasks: Task[];
  organizationId: string;
  onEdit: (task: Task) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const VirtualizedTaskTable = ({
  tasks,
  organizationId,
  onEdit,
  containerRef,
}: VirtualizedTaskTableProps) => {
  const deleteTask = useDeleteTask(organizationId);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setDeletingId(taskId);
    try {
      await deleteTask.mutateAsync({ id: taskId, organizationId });
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-[600px] overflow-auto"
      data-virtualized
      data-testid="virtualized-list"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const task = tasks[virtualRow.index];
          return (
            <div
              key={task.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="border-b border-border-300 px-4 py-3 hover:bg-accent-500/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-100 font-medium truncate">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-400 mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-medium ${getTaskPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.assignedTo && (
                      <span className="text-xs text-muted-400">
                        Assigned to {task.assignedTo.name || task.assignedTo.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(task)}
                    aria-label={`Edit task ${task.title}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                    disabled={deletingId === task.id}
                    aria-label={`Delete task ${task.title}`}
                  >
                    {deletingId === task.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
