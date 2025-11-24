import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { getServerSession } from './auth';
import { prisma } from './prisma';

export const createTRPCContext = async (opts?: { req?: Request }) => {
  const session = await getServerSession(opts?.req);
  return {
    session,
    prisma,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: { 
        ...ctx.session, 
        user: { 
          ...ctx.session.user, 
          id: ctx.session.user.id 
        } 
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

