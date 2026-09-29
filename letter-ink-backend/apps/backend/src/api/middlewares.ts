import { defineMiddlewares } from "@medusajs/medusa";
import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

const isLocalhost = (ip?: string) => {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1" ||
    ip === "localhost"
  );
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 30, // Relaxed in development
  skip: (req) => isDev || isLocalhost(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication requests from this IP, please try again after 15 minutes" },
});

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: isDev ? 100000 : 1000, // High limit in development for Next.js SSR requests
  skip: (req) => isDev || isLocalhost(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again later" },
});

export default defineMiddlewares({
  routes: [
    {
      matcher: "/auth/*",
      middlewares: [authLimiter],
    },
    {
      matcher: "/store/*",
      middlewares: [defaultLimiter],
    },
    {
      matcher: "/admin/*",
      middlewares: [defaultLimiter],
    },
  ],
});
