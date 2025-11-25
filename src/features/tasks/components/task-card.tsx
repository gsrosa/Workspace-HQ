'use client';

import React from 'react';
import type { Task } from '../shared/models';
import { getTaskStatusColor, getTaskPriorityColor } from '../utils/task-helpers';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/features/orgs';
import { Role } from '@prisma/client';
import { Pencil as PencilIcon, Trash2 as Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  organizationId: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDeleting?: boolean;
}

export const TaskCard = ({ task, organizationId, onEdit, onDelete, isDeleting }: TaskCardProps) => {
  const { data: roleData } = useUserRole(organizationId);
  const userRole = roleData?.role;
  const canDelete = userRole && userRole !== Role.MEMBER;

  return (
    <div className="bg-surface-600 border border-border-300 rounded-lg p-4 hover:border-accent-500/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-text-100 font-medium text-sm flex-1 pr-2">{task.title}</h3>
        {canDelete && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded hover:bg-surface-500 text-muted-400 hover:text-text-100 transition-colors"
              aria-label={`Edit task ${task.title}`}
            >
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
              className="p-1.5 rounded hover:bg-danger-500/10 text-muted-400 hover:text-danger-500 transition-colors disabled:opacity-50"
              aria-label={`Delete task ${task.title}`}
            >
              <Trash2Icon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-muted-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded', getTaskPriorityColor(task.priority))}>
          {task.priority}
        </span>
        {task.assignedTo && (
          <span className="text-xs text-muted-400">
            {task.assignedTo.name || task.assignedTo.email}
          </span>
        )}
        {task.createdBy && (
          <span className="text-xs text-muted-400">
            by {task.createdBy.name || task.createdBy.email}
          </span>
        )}
      </div>
    </div>
  );
};

