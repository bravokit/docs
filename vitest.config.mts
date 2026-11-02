import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    // Unit tests live next to the code they test. Browser flows live in e2e/ (Playwright).
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.{ts,mts}"],
    environment: "jsdom",
    // next-intl imports `next/navigation` without a file extension, which only bundlers resolve;
    // processing it through Vite makes that work in tests.
    server: { deps: { inline: ["next-intl"] } },
  },
});
