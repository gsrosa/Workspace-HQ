import { router } from '@/lib/trpc';
import { orgRouter } from './org.router';
import { rbacRouter } from './rbac.router';
import { taskRouter } from './task.router';

export const appRouter = router({
  org: orgRouter,
  rbac: rbacRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;

