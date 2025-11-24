'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

interface TaskStatusChartProps {
  todo: number;
  inProgress: number;
  done: number;
  className?: string;
}

// Colors matching the dark theme
const COLORS = {
  todo: '#f59e0b', // amber-500 - for todo tasks
  inProgress: '#3b82f6', // blue-500 - for in progress tasks
  done: '#10b981', // green-500 - for done tasks
};

export const TaskStatusChart = ({ todo, inProgress, done, className }: TaskStatusChartProps) => {
  const pieData = [
    { name: 'To Do', value: todo, color: COLORS.todo },
    { name: 'In Progress', value: inProgress, color: COLORS.inProgress },
    { name: 'Done', value: done, color: COLORS.done },
  ].filter((item) => item.value > 0);

  const barData = [
    { status: 'To Do', count: todo },
    { status: 'In Progress', count: inProgress },
    { status: 'Done', count: done },
  ];

  const total = todo + inProgress + done;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-surface-700 border border-border-300 rounded-lg p-3 shadow-lg">
          <p className="text-text-100 font-medium">{data.name}</p>
          <p className="text-accent-400">
            {data.value} tasks ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={cn('bg-surface-600 border border-border-300 rounded-xl p-6', className)}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-100">Task Status Distribution</h2>
        <p className="text-sm text-muted-400 mt-1">Overview of tasks by status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h3 className="text-sm font-medium text-muted-400 mb-4">Distribution</h3>
          {total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }}
                  formatter={(value, entry: any) => (
                    <span style={{ color: '#d1d5db', marginLeft: '8px' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-400">No tasks to display</p>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-sm font-medium text-muted-400 mb-4">Count by Status</h3>
          {total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="status"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                  }}
                  labelStyle={{ color: '#d1d5db' }}
                />
                <Bar
                  dataKey="count"
                  radius={[8, 8, 0, 0]}
                >
                  {barData.map((entry, index) => {
                    let color = COLORS.todo;
                    if (entry.status === 'In Progress') color = COLORS.inProgress;
                    if (entry.status === 'Done') color = COLORS.done;
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-400">No tasks to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border-300 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.todo }} />
            <span className="text-sm font-medium text-muted-400">To Do</span>
          </div>
          <p className="text-2xl font-bold text-text-100">{todo}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.inProgress }} />
            <span className="text-sm font-medium text-muted-400">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-text-100">{inProgress}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.done }} />
            <span className="text-sm font-medium text-muted-400">Done</span>
          </div>
          <p className="text-2xl font-bold text-text-100">{done}</p>
        </div>
      </div>
    </div>
  );
};

