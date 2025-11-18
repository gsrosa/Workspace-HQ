import type { AppRouter } from '@/server/routers/_app';
import type { inferRouterOutputs } from '@trpc/server';

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Task = RouterOutputs['task']['listTasks']['tasks'][number];
