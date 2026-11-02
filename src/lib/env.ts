import "server-only";

import { parseEnv, type Env } from "./env-schema";

// Server code imports `env` instead of reading process.env, so a missing or malformed variable
// fails here with a clear message rather than deep inside a page.
export const env: Env = parseEnv(process.env);
