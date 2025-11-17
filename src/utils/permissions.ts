import { Role } from '@prisma/client';

export const isRoleAllowed = (userRole: Role, allowedRoles: Role[]): boolean => {
  return allowedRoles.includes(userRole);
};

