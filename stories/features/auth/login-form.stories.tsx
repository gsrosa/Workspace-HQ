import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from '@/features/auth';

const meta: Meta<typeof LoginForm> = {
  title: 'Features/Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md bg-surface-600 border border-border-300 rounded-xl p-8">
      <LoginForm />
    </div>
  ),
};

