import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function OnboardingPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-text-100">
            Welcome, {session.user.name || session.user.email}!
          </h1>
          <p className="mt-2 text-muted-400">
            Let's get you started with WorkspaceHQ
          </p>
        </div>
        <div className="bg-surface-600 border border-border-300 rounded-xl p-8 space-y-4">
          <p className="text-text-100">
            Your account has been created successfully. You can now create your first organization.
          </p>
          <Link href="/orgs/new">
            <Button className="w-full">Create Organization</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

