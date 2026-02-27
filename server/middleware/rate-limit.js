/**
 * Simple in-memory rate limiter middleware.
 * Options:
 *   windowMs  – time window in milliseconds (default 15 min)
 *   max       – max requests per window per IP (default 100)
 *   message   – error message when limit exceeded
 */
export function rateLimit({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.' } = {}) {
  const hits = new Map(); // ip -> { count, resetTime }

  // Periodically clean up expired entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (now >= entry.resetTime) hits.delete(ip);
    }
  }, windowMs);
  cleanupInterval.unref?.();

  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(ip);

    if (!entry || now >= entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      hits.set(ip, entry);
    }

    entry.count += 1;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

    if (entry.count > max) {
      return res.status(429).json({ error: message });
    }

    next();
  };
}

/** Strict rate limiter for login endpoint: 5 attempts per 15 minutes */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

/** General API rate limiter: 200 requests per minute */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: 'Too many requests, please slow down.',
});
