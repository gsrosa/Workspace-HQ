import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('TDD-12: Rate-limit org creation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow requests within rate limit', async () => {
    const result = await rateLimit.check('test-key', 10, '10s');
    expect(result.success).toBe(true);
  });

  it('should block requests exceeding rate limit', async () => {
    const key = `test-key-${Date.now()}`;
    const limit = 3;
    const window = '1s';

    // Make requests up to limit
    for (let i = 0; i < limit; i++) {
      const result = await rateLimit.check(key, limit, window);
      expect(result.success).toBe(true);
    }

    // Next request should be blocked
    const blocked = await rateLimit.check(key, limit, window);
    expect(blocked.success).toBe(false);
    expect(blocked.limit).toBe(limit);
  });

  it('should reset after window expires', async () => {
    const key = `test-key-reset-${Date.now()}`;
    const limit = 2;
    const window = '1s';

    // Exceed limit
    await rateLimit.check(key, limit, window);
    await rateLimit.check(key, limit, window);
    const blocked = await rateLimit.check(key, limit, window);
    expect(blocked.success).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Should allow again
    const allowed = await rateLimit.check(key, limit, window);
    expect(allowed.success).toBe(true);
  });
});

