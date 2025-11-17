export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
} as const;

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/orgs',
] as const;

