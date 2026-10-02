import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const placeholders = [
  "replace_with_secure_random_jwt_secret_min_32_chars",
  "replace_with_secure_random_cookie_secret_min_32_chars",
  "replace_with_32_byte_hex_encryption_key"
];

if (
  placeholders.includes(process.env.JWT_SECRET || "") ||
  placeholders.includes(process.env.COOKIE_SECRET || "") ||
  placeholders.includes(process.env.AUTH_MFA_ENCRYPTION_KEY || "")
) {
  throw new Error("CRITICAL SECURITY ERROR: You are using placeholder secrets in the environment variables. Please rotate them immediately.");
}

if (process.env.NODE_ENV === "production") {
  const corsVars = [process.env.STORE_CORS, process.env.ADMIN_CORS, process.env.AUTH_CORS];
  if (corsVars.some(c => c && (c.includes("localhost") || c.includes("127.0.0.1")))) {
    throw new Error("CRITICAL SECURITY ERROR: Localhost CORS origins are not allowed in production.");
  }
}
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    {
      resolve: "./src/modules/workshop",
    },
    {
      resolve: "./src/modules/customizations",
    },
    {
      resolve: "./src/modules/blog",
    }
  ]
})
