import { defineMiddlewares } from "@medusajs/medusa";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per 15 min window for auth
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication requests from this IP, please try again after 15 minutes" },
});

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // higher limit for general API use
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
