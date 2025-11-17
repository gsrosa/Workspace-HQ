import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, name, ...props }, ref) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-100 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg',
            'bg-surface-600 border border-border-300',
            'text-text-100 placeholder:text-muted-400',
            'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
            'transition-colors',
            error && 'border-danger-500 focus:ring-danger-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-danger-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

