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
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-100">Create Organization</h1>
          <p className="text-muted-400 mt-2">
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

