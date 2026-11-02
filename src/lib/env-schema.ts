import { z } from "zod";

// Every environment variable the site reads is declared here, and only here. It's a static site
// with no secrets: add new variables to .env.example in the same change.
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url({
    protocol: /^https?$/,
    error: "must be the site's public http(s) URL, e.g. http://localhost:3000",
  }),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates an environment and throws one readable error listing every problem.
 * Empty strings count as missing: `FOO=` in a .env file is a common copy-paste slip.
 */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const cleaned = Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== undefined && value !== ""),
  );
  const result = envSchema.safeParse(cleaned);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}\n` +
        "Copy .env.example to .env and fill in the missing values.",
    );
  }
  return result.data;
}
