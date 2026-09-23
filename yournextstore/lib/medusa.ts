// Shim legacy url.parse for @medusajs/medusa-js (axios) to prevent Node 22+ [DEP0169] deprecation warning
if (typeof window === "undefined") {
	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const nodeUrl = require("node:url");
		if (nodeUrl && nodeUrl.parse) {
			const originalParse = nodeUrl.parse;
			nodeUrl.parse = function (urlString: string, ...args: any[]) {
				try {
					const u = new URL(urlString, "http://localhost");
					return {
						protocol: u.protocol,
						slashes: true,
						auth: u.username ? (u.password ? `${u.username}:${u.password}` : u.username) : null,
						host: u.host,
						port: u.port,
						hostname: u.hostname,
						hash: u.hash,
						search: u.search,
						query: args[0] ? Object.fromEntries(u.searchParams) : u.search ? u.search.slice(1) : null,
						pathname: u.pathname,
						path: u.pathname + u.search,
						href: u.href,
					};
				} catch {
					return originalParse.call(nodeUrl, urlString, ...args);
				}
			};
		}
	} catch {}
}

import Medusa from "@medusajs/medusa-js";
import { cacheLife } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

if (!PUBLISHABLE_KEY && process.env.NODE_ENV === "development") {
  console.warn("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. API calls to Medusa may fail.");
}

export const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: PUBLISHABLE_KEY,
});

// Polyfills for getStoreSeo etc since Medusa doesn't have a direct equivalent
export async function getStoreSeo() {
  "use cache";
  cacheLife("hours");

  return {
    storeName: "The Letter Ink",
    storeDescription: "The Letter Ink",
  };
}

export function getStoreFaviconUrl(settings?: any) {
  return null;
}

export function getCanonicalUrl(): string {
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const getSubdomainPublicUrl = () => {
  return Promise.resolve({ subdomain: null, publicUrl: getCanonicalUrl() });
};
