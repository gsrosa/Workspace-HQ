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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-100 mb-4">Users</h1>
      <p className="text-muted-400">Users page for organization {params.orgId}</p>
    </div>
  );
}

