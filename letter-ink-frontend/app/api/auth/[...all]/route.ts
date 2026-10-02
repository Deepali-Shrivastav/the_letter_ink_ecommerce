import { type NextRequest, NextResponse } from "next/server";
import { getSubdomainPublicUrl } from "@/lib/commerce";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

async function handler(request: NextRequest) {
	const ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
	
	const rateLimitResult = await rateLimit(ip, 20, 60000); // 20 reqs per minute
	if (!rateLimitResult.success) {
		logger.warn(`[auth proxy] Rate limit exceeded for IP: ${ip}`);
		return NextResponse.json(
			{ error: "Too many requests. Please try again later." },
			{ 
				status: 429,
				headers: {
					"Retry-After": Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
					"X-RateLimit-Limit": rateLimitResult.limit.toString(),
					"X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
				} 
			}
		);
	}

	// better-auth lives on the apex (global users), not the tenant subdomain — on a
	// tenant subdomain `/api/auth/*` rewrites into `[domain]` and 404s. Target the apex,
	// same as the page proxy in proxy.ts.
	const { publicUrl } = await getSubdomainPublicUrl();

	const url = new URL(request.nextUrl.pathname + request.nextUrl.search, publicUrl);

	const requestHeaders = new Headers(request.headers);
	requestHeaders.delete("host");
	requestHeaders.delete("accept-encoding");
	if (!requestHeaders.has("x-forwarded-for")) {
		requestHeaders.set("x-forwarded-for", ip);
	}

	const body =
		request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined;

	try {
		const response = await fetch(url, {
			method: request.method,
			headers: requestHeaders,
			body,
		});

		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete("content-encoding");
		responseHeaders.delete("content-length");

		return new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	} catch (error) {
		logger.error(`[auth proxy] ${request.method} ${request.nextUrl.pathname} failed:`, error);
		return NextResponse.json({ error: "Authentication service unavailable" }, { status: 502 });
	}
}

export { handler as GET, handler as POST };
