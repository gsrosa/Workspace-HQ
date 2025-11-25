'use client';

import React from 'react';
import type { Task } from '../shared/models';
import { TaskCard } from './task-card';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  organizationId: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  deletingId?: string | null;
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
];

export const KanbanBoard = ({
  tasks,
  organizationId,
  onEdit,
  onDelete,
  deletingId,
}: KanbanBoardProps) => {
  const tasksByStatus = React.useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === 'todo'),
      in_progress: tasks.filter((task) => task.status === 'in_progress'),
      done: tasks.filter((task) => task.status === 'done'),
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map((column) => {
        const columnTasks = tasksByStatus[column.status];
        return (
          <div key={column.id} className="flex flex-col">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-text-100">
                {column.title}
              </h3>
              <span className="text-xs text-muted-400">
                {columnTasks.length} {columnTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <div className="flex-1 bg-surface-700 border border-border-300 rounded-lg p-3 min-h-[400px]">
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-400 text-sm">
                  No tasks
                </div>
              ) : (
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      organizationId={organizationId}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDeleting={deletingId === task.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

