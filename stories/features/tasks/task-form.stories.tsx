import type { Meta, StoryObj } from '@storybook/react';
import { TaskForm } from '@/features/tasks';

const meta: Meta<typeof TaskForm> = {
  title: 'Features/Tasks/TaskForm',
  component: TaskForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskForm>;

export const Create: Story = {
  render: () => (
    <TaskForm
      open={true}
      onOpenChange={() => {}}
      organizationId="test-org-id"
    />
  ),
};

export const Edit: Story = {
  render: () => (
    <TaskForm
      open={true}
      onOpenChange={() => {}}
      organizationId="test-org-id"
      task={{
        id: 'task-1',
        title: 'Example Task',
        description: 'This is an example task description',
        status: 'in_progress',
        priority: 'high',
        organizationId: 'test-org-id',
        assignedToId: null,
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }}
    />
  ),
};

