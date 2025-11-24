import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory fallback for development
const memoryStore = new Map<string, { count: number; reset: number }>();

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const parseWindow = (window: string): number => {
  const match = window.match(/^(\d+)([smhd])$/);
  if (!match) return 10000; // default 10s

  const value = parseInt(match[1]!);
  const unit = match[2]!;

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 10000;
  }
};

const createMemoryRateLimit = () => ({
  check: async (identifier: string, limit: number, window: string) => {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowMs = parseWindow(window);
    const record = memoryStore.get(key);

    if (!record || now > record.reset) {
      memoryStore.set(key, { count: 1, reset: now + windowMs });
      return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
    }

    if (record.count >= limit) {
      return { success: false, limit, remaining: 0, reset: record.reset };
    }

    record.count++;
    memoryStore.set(key, record);
    return { success: true, limit, remaining: limit - record.count, reset: record.reset };
  },
});

const upstashRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
    })
  : null;

// Unified rate limit interface
export const rateLimit = {
  check: async (identifier: string, limit: number, window: string) => {
    if (upstashRateLimit) {
      const result = await upstashRateLimit.limit(identifier);
      return {
        success: result.success,
        limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } else {
      return await createMemoryRateLimit().check(identifier, limit, window);
    }
  },
};

// Helper function for tRPC middleware
export const checkRateLimit = async (identifier: string, limit: number, window: string) => {
  return await rateLimit.check(identifier, limit, window);
};
