import { randomBytes } from 'crypto';

export function generateInviteToken(): string {
  return randomBytes(32).toString('hex');
}

export function getInviteExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24); // 24 hours from now
  return expiry;
}

