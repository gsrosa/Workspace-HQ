import { router } from '@/lib/trpc';
import { orgRouter } from './org.router';
import { rbacRouter } from './rbac.router';
import { taskRouter } from './task.router';
import { dashboardRouter } from './dashboard.router';

export const appRouter = router({
  org: orgRouter,
  rbac: rbacRouter,
  task: taskRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;

