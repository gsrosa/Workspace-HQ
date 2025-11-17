import { describe, it, expect } from 'vitest';
import { isRoleAllowed } from '@/utils/permissions';
import { Role } from '@prisma/client';

describe('TDD-13: Permission utils', () => {
  it('isRoleAllowed(ADMIN, [ADMIN, OWNER]) → true', () => {
    expect(isRoleAllowed(Role.ADMIN, [Role.ADMIN, Role.OWNER])).toBe(true);
  });

  it('isRoleAllowed(MEMBER, [ADMIN]) → false', () => {
    expect(isRoleAllowed(Role.MEMBER, [Role.ADMIN])).toBe(false);
  });

  it('isRoleAllowed(OWNER, [OWNER, ADMIN]) → true', () => {
    expect(isRoleAllowed(Role.OWNER, [Role.OWNER, Role.ADMIN])).toBe(true);
  });

  it('isRoleAllowed(MEMBER, [MEMBER]) → true', () => {
    expect(isRoleAllowed(Role.MEMBER, [Role.MEMBER])).toBe(true);
  });
});

