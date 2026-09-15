import Medusa from "@medusajs/medusa-js";
import { cacheLife } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test_dummykey",
});

// Polyfills for getStoreSeo etc since Medusa doesn't have a direct equivalent
export async function getStoreSeo() {
  "use cache";
  cacheLife("hours");

  return {
    storeName: "Your Next Store",
    storeDescription: "Powered by Medusa",
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
