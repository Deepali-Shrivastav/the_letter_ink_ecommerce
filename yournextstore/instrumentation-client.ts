// Sandbox inspectors (dev-only, self-gated on NODE_ENV). Next.js inlines
// NEXT_PUBLIC_* at build time, so production builds DCE this branch.
if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
  // Removed commerce-kit/sandbox-inspectors
}
// ─── Platform storefront kit (do not modify) ────────────────────────────────
// Analytics/tracking runtime generated per store by the platform and served
// through the /_public proxy (see proxy.ts). Stores without trackers get a
// no-op script. Never add tracker snippets (fbq, gtag, …) to template code —
// publish events via lib/track.tsx instead.
//
// Production only: the /design sandbox preview and Vercel preview deploys run
// this same code, and builder/preview traffic must never pollute the
// merchant's real ad and analytics data.
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
	const kit = document.createElement("script");
	kit.src = "/_public/kit.js";
	kit.async = true;
	document.head.appendChild(kit);
}
