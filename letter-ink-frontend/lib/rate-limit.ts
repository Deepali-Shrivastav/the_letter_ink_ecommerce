import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 20 requests per 1 minute
let ratelimit: Ratelimit | null = null;

try {
	if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
		ratelimit = new Ratelimit({
			redis: Redis.fromEnv(),
			limiter: Ratelimit.slidingWindow(20, "1 m"),
			analytics: true,
		});
	}
} catch (e) {
	console.warn("Failed to initialize Upstash Ratelimit", e);
}

// Fallback in-memory map for local development when Upstash is not configured
const fallbackRateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function rateLimit(
	ip: string,
	limit = 20,
	windowMs = 60000, // 1 minute
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
	if (ratelimit) {
		try {
			const { success, limit: upstashLimit, remaining, reset } = await ratelimit.limit(ip);
			return { success, limit: upstashLimit, remaining, reset };
		} catch (e) {
			console.error("Upstash rate limit error:", e);
			// Fall through to in-memory if Upstash fails
		}
	}

	// Local fallback (in-memory)
	const now = Date.now();
	const windowStart = now - windowMs;

	if (Math.random() < 0.05) {
		for (const [key, value] of fallbackRateLimitMap.entries()) {
			if (value.lastReset < windowStart) {
				fallbackRateLimitMap.delete(key);
			}
		}
	}

	const record = fallbackRateLimitMap.get(ip);
	if (!record || record.lastReset < windowStart) {
		fallbackRateLimitMap.set(ip, { count: 1, lastReset: now });
		return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
	}

	record.count += 1;
	fallbackRateLimitMap.set(ip, record);

	if (record.count > limit) {
		return { success: false, limit, remaining: 0, reset: record.lastReset + windowMs };
	}

	return { success: true, limit, remaining: limit - record.count, reset: record.lastReset + windowMs };
}
