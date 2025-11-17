'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '../shared/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../hooks/use-auth';

export const SignupForm = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      // Create user via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setError('root', { message: error.message || 'Failed to create account' });
        return;
      }

      // Auto-login after signup
      const result = await signIn(data.email, data.password);
      if (result?.ok) {
        router.push('/onboarding');
        router.refresh();
      } else {
        // If auto-login fails, redirect to login page
        router.push('/login');
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <Input
        {...register('name')}
        label="Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        autoComplete="name"
      />
      <Input
        {...register('email')}
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        autoComplete="email"
      />
      <Input
        {...register('password')}
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        autoComplete="new-password"
      />
      {errors.root && (
        <p className="text-sm text-danger-500" role="alert">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
};

