'use client';

import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Task } from '../shared/models';
import { getStatusColor, getPriorityColor, formatTaskDate } from '../utils/task-helpers';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VirtualizedTaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  parentRef: React.RefObject<HTMLDivElement>;
}

export const VirtualizedTaskTable = ({
  tasks,
  onEdit,
  onDelete,
  parentRef,
}: VirtualizedTaskTableProps) => {
  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
      data-testid="task-list"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const task = tasks[virtualItem.index];
          return (
            <div
              key={task.id}
              data-testid="task-row"
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className={cn(
                'flex items-center gap-4 p-4 border-b border-border-300',
                'hover:bg-accent-500/5 transition-colors',
                'group'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium text-text-100 truncate">{task.title}</h3>
                  <span className={cn('text-xs px-2 py-0.5 rounded', getStatusColor(task.status))}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={cn('text-xs px-2 py-0.5 rounded', getPriorityColor(task.priority))}>
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-400 truncate">{task.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-400">
                  <span>{formatTaskDate(task.createdAt)}</span>
                  {task.assignedTo && (
                    <span>Assigned to {task.assignedTo.name || task.assignedTo.email}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  onClick={() => onDelete(task)}
                  aria-label={`Delete task ${task.title}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

