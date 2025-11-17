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

export const rateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
    })
  : {
      limit: async (identifier: string) => {
        const key = `ratelimit:${identifier}`;
        const now = Date.now();
        const record = memoryStore.get(key);

        if (!record || now > record.reset) {
          memoryStore.set(key, { count: 1, reset: now + 10000 });
          return { success: true, limit: 10, remaining: 9, reset: now + 10000 };
        }

        if (record.count >= 10) {
          return { success: false, limit: 10, remaining: 0, reset: record.reset };
        }

        record.count++;
        memoryStore.set(key, record);
        return { success: true, limit: 10, remaining: 10 - record.count, reset: record.reset };
      },
    };

