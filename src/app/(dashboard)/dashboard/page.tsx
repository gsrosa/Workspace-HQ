import React, { Suspense } from 'react';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardContent, DashboardSkeleton } from '@/features/dashboard';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="p-6 lg:p-8">
      <DashboardHeader />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
