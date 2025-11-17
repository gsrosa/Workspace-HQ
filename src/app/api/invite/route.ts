import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
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

  return NextResponse.json({
    valid: true,
    email: membership.user.email,
    organizationId: membership.organizationId,
    organizationName: membership.organization.name,
    role: membership.role,
  });
}

