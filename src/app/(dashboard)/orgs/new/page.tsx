import React from 'react';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { OrgForm } from '@/features/orgs';

export default async function NewOrgPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-100">Create Organization</h1>
          <p className="mt-2 text-muted-400">
            Create a new organization to get started
          </p>
        </div>
        <div className="bg-surface-600 border border-border-300 rounded-xl p-8">
          <OrgForm />
        </div>
      </div>
    </div>
  );
}

