import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-100">Welcome back</h1>
          <p className="mt-2 text-muted-400">Sign in to your account</p>
        </div>
        <div className="bg-surface-600 border border-border-300 rounded-xl p-8">
          <LoginForm />
        </div>
        <p className="text-center text-sm text-muted-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent-500 hover:text-accent-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

