/**
 * Production-ready application logger for TheLetterInk.
 * Automatically sanitizes sensitive keys and limits verbosity in production.
 */

const IS_PROD = process.env.NODE_ENV === "production";

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "key",
  "api_key",
  "publishableApiKey",
  "credit_card",
  "cvv",
]);

function sanitizeData(data: unknown, depth = 0): unknown {
  if (depth > 4) return "[Max Depth Reached]";
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Redact bearer tokens or high-entropy key patterns if present in strings
    return data.replace(/(Bearer\s+)[A-Za-z0-9-_.]+/gi, "$1[REDACTED]");
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, depth + 1));
  }

  if (data instanceof Error) {
    return {
      name: data.name,
      message: data.message,
      ...(IS_PROD ? {} : { stack: data.stack }),
    };
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = sanitizeData(value, depth + 1);
      }
    }
    return sanitized;
  }

  return data;
}

export const logger = {
  info(message: string, ...args: unknown[]) {
    if (!IS_PROD) {
      console.info(`[INFO] ${message}`, ...args.map((a) => sanitizeData(a)));
    }
  },

  warn(message: string, ...args: unknown[]) {
    console.warn(`[WARN] ${message}`, ...args.map((a) => sanitizeData(a)));
  },

  error(message: string, ...args: unknown[]) {
    console.error(`[ERROR] ${message}`, ...args.map((a) => sanitizeData(a)));
  },

  debug(message: string, ...args: unknown[]) {
    if (!IS_PROD) {
      console.debug(`[DEBUG] ${message}`, ...args.map((a) => sanitizeData(a)));
    }
  },
};
