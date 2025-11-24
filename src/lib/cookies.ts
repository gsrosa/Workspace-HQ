'use server';

import { cookies } from 'next/headers';

const ORG_ID_COOKIE_NAME = 'workspace-hq-org-id';

export async function getSelectedOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ORG_ID_COOKIE_NAME)?.value || null;
}

export async function setSelectedOrgId(orgId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ORG_ID_COOKIE_NAME, orgId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    httpOnly: false, // Allow client-side access
  });
}

