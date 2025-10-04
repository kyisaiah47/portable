/**
 * Environment variable validation
 * Validates required environment variables at app startup
 */

const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const;

const optionalEnvVars = {
  // Plaid (optional - only needed for bank connections)
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SECRET: process.env.PLAID_SECRET,
  PLAID_ENV: process.env.PLAID_ENV,

  // Cron job secret (optional - only needed for scheduled jobs)
  CRON_SECRET: process.env.CRON_SECRET,

  // Email service (optional - only needed for weekly reports)
  RESEND_API_KEY: process.env.RESEND_API_KEY,
} as const;

export function validateEnv() {
  const missing: string[] = [];

  // Check required variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.includes('placeholder') || value.includes('YOUR-')) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing or invalid required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env.local file.`
    );
  }
}

export function getEnv() {
  return {
    ...requiredEnvVars,
    ...optionalEnvVars,
  };
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}
