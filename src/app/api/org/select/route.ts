import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orgId } = body as { orgId?: string };

    if (!orgId || typeof orgId !== 'string') {
      return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
    }

    // Verify user is a member of this organization
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const membership = await prisma.organizationUser.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('workspace-hq-org-id', orgId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false,
    });

    return NextResponse.json({ success: true, orgId });
  } catch (error) {
    console.error('Error setting org cookie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

