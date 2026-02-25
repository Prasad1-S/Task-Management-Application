const store = new Map();

/**
 * @param {string} key - unique identifier (e.g. IP address)
 * @param {number} limit - max requests allowed
 * @param {number} windowMs - time window in milliseconds
 * @returns {{ success: boolean, remaining: number, resetIn: number }}
 */
export function rateLimit(key, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetIn: record.resetAt - now };
  }

  record.count++;
  return { success: true, remaining: limit - record.count, resetIn: record.resetAt - now };
}

// Clean up expired entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) store.delete(key);
  }
}, 5 * 60_000);