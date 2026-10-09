interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipAttempts = new Map<string, RateLimitRecord>();

/**
 * Sliding Window IP Rate Limiter
 * Default: 5 failed attempts per minute per IP address
 */
export function checkRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const record = ipAttempts.get(ip);

  if (!record || now > record.resetAt) {
    ipAttempts.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Resets rate limit counter on successful authentication
 */
export function clearRateLimit(ip: string): void {
  ipAttempts.delete(ip);
}
