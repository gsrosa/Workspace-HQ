import React from 'react';
import Link from 'next/link';
import { SignupForm } from '@/features/auth';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-100">Create an account</h1>
          <p className="mt-2 text-muted-400">Get started with WorkspaceHQ</p>
        </div>
        <div className="bg-surface-600 border border-border-300 rounded-xl p-8">
          <SignupForm />
        </div>
        <p className="text-center text-sm text-muted-400">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-500 hover:text-accent-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

