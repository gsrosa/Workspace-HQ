import React from 'react';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function UsersPage({
  params,
}: {
  params: { orgId: string };
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-100">Users</h1>
        <p className="text-muted-400 mt-2">Manage organization members and permissions</p>
      </div>
      <div className="bg-surface-600 border border-border-300 rounded-lg p-6">
        <p className="text-muted-400">Users management coming soon...</p>
      </div>
    </div>
  );
}

