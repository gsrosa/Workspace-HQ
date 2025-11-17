import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const session = await getServerSession();

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const membership = await prisma.organizationUser.findUnique({
    where: { inviteToken: token },
    include: {
      organization: true,
      user: true,
    },
  });

  if (!membership) {
    return NextResponse.json({ error: 'Invalid invite token' }, { status: 404 });
  }

  if (membership.inviteTokenExpires && membership.inviteTokenExpires < new Date()) {
    return NextResponse.json({ error: 'Invite token has expired' }, { status: 400 });
  }

  if (membership.user.email !== session.user.email) {
    return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
  }

  // Accept invite by clearing token
  await prisma.organizationUser.update({
    where: { inviteToken: token },
    data: {
      inviteToken: null,
      inviteTokenExpires: null,
    },
  });

  return NextResponse.json({
    organizationId: membership.organizationId,
    organizationName: membership.organization.name,
  });
}

