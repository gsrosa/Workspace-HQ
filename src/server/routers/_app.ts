import { router } from '@/lib/trpc';
import { orgRouter } from './org.router';

export const appRouter = router({
  org: orgRouter,
});

export type AppRouter = typeof appRouter;

