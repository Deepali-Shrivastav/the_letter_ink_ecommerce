const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(
	ip: string,
	limit: number = 20,
	windowMs: number = 60000 // 1 minute
): { success: boolean; limit: number; remaining: number; reset: number } {
	const now = Date.now();
	const windowStart = now - windowMs;

	// Cleanup old entries (simple garbage collection)
	if (Math.random() < 0.05) {
		for (const [key, value] of rateLimitMap.entries()) {
			if (value.lastReset < windowStart) {
				rateLimitMap.delete(key);
			}
		}
	}

	const record = rateLimitMap.get(ip);
	
	if (!record || record.lastReset < windowStart) {
		rateLimitMap.set(ip, { count: 1, lastReset: now });
		return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
	}

	record.count += 1;
	rateLimitMap.set(ip, record);

	if (record.count > limit) {
		return { success: false, limit, remaining: 0, reset: record.lastReset + windowMs };
	}

	return { success: true, limit, remaining: limit - record.count, reset: record.lastReset + windowMs };
}
