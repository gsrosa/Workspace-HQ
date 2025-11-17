import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SignupForm } from '@/features/auth';

async function getInviteData(token: string) {
  const membership = await prisma.organizationUser.findUnique({
    where: { inviteToken: token },
    include: {
      organization: true,
      user: true,
    },
  });

  if (!membership) {
    return null;
  }

  if (membership.inviteTokenExpires && membership.inviteTokenExpires < new Date()) {
    return null;
  }

  return {
    email: membership.user.email,
    organizationId: membership.organizationId,
    organizationName: membership.organization.name,
    role: membership.role,
    hasPassword: !!membership.user.password,
  };
}

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const session = await getServerSession();
  const inviteData = await getInviteData(params.token);

  if (!inviteData) {
    redirect('/login?error=invalid_invite');
  }

  // If user is already logged in and matches the invite email, accept automatically
  if (session?.user?.email === inviteData.email && inviteData.hasPassword) {
    // Accept invite
    await prisma.organizationUser.update({
      where: { inviteToken: params.token },
      data: {
        inviteToken: null,
        inviteTokenExpires: null,
      },
    });
    redirect(`/orgs/${inviteData.organizationId}/tasks`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-100">
            You've been invited to {inviteData.organizationName}
          </h1>
          <p className="mt-2 text-muted-400">
            {inviteData.hasPassword
              ? 'Sign in to accept the invite'
              : 'Create an account to accept the invite'}
          </p>
        </div>
        <div className="bg-surface-600 border border-border-300 rounded-xl p-8">
          {inviteData.hasPassword ? (
            <p className="text-text-100">
              Please sign in with {inviteData.email} to accept the invite.
            </p>
          ) : (
            <SignupForm inviteToken={params.token} />
          )}
        </div>
      </div>
    </div>
  );
}

