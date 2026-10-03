import type { NextConfig } from "next";

// Suppress Node.js 22+ DEP0169 url.parse deprecation warning caused by legacy client dependencies
if (typeof process !== "undefined" && process.emitWarning) {
	const originalEmitWarning = process.emitWarning;
	process.emitWarning = (warning: any, ...args: any[]) => {
		if (
			(typeof warning === "string" && (warning.includes("DEP0169") || warning.includes("url.parse"))) ||
			(typeof warning === "object" && warning?.code === "DEP0169")
		) {
			return;
		}
		return (originalEmitWarning as any).apply(process, [warning, ...args]);
	};
}

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["*.vercel.run"],
	devIndicators: false,
	typescript: {
		ignoreBuildErrors: true,
	},
	reactCompiler: true,
	cacheComponents: true,
	partialPrefetching: false,
	experimental: {
		// Run the React Compiler natively in Turbopack instead of through Babel (16.3 experimental).
		turbopackRustReactCompiler: true,
		typedEnv: true,
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-label",
			"@radix-ui/react-popover",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-select",
			"@radix-ui/react-slider",
			"@radix-ui/react-slot",
			"@radix-ui/react-tooltip",
			"class-variance-authority",
		],
	},
	images: {
		// Store media remote image patterns
		remotePatterns: [
			{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
			{ protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
			{ protocol: "https", hostname: "images.pexels.com" },
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "lh3.googleusercontent.com" },
			{ protocol: "https", hostname: "*.googleusercontent.com" },
			{ protocol: "https", hostname: "commondatastorage.googleapis.com" },
			{ protocol: "https", hostname: "*.googleapis.com" },
			{ protocol: "http", hostname: "localhost" },
			{ protocol: "http", hostname: "localhost", port: "9000" },
			{ protocol: "http", hostname: "127.0.0.1", port: "9000" },
		],
		dangerouslyAllowLocalIP: true,
	},
	async headers() {
		const securityHeaders = [
			{ key: "X-DNS-Prefetch-Control", value: "on" },
			{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
			{ key: "X-XSS-Protection", value: "1; mode=block" },
			{ key: "X-Frame-Options", value: "SAMEORIGIN" },
			{ key: "X-Content-Type-Options", value: "nosniff" },
			{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
			{
				key: "Content-Security-Policy",
				value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: http://localhost:9000; frame-src 'self' https://checkout.razorpay.com;",
			},
		];

		if (isProd) {
			return [
				{
					source: "/:path*",
					headers: securityHeaders,
				},
			];
		}

		// Dev-only: AI Builder renders this app in an iframe, and Chrome's HTTP cache
		// holds stale sub-resources inside iframes — HMR fires but the preview never
		// sees it. See https://github.com/vercel/next.js/issues/90143.
		return [
			{
				source: "/:path*",
				headers: [
					...securityHeaders,
					{ key: "Cache-Control", value: "no-store, must-revalidate" },
					{ key: "Pragma", value: "no-cache" },
				],
			},
		];
	},
};

export default nextConfig;
