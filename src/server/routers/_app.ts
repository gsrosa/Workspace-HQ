import { router } from '@/lib/trpc';
import { orgRouter } from './org.router';
import { rbacRouter } from './rbac.router';

export const appRouter = router({
  org: orgRouter,
  rbac: rbacRouter,
});

export type AppRouter = typeof appRouter;

