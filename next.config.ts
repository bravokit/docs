import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { parseEnv } from "./src/lib/env-schema";

// Fail `next dev` and `next build` at startup when the environment is invalid.
parseEnv(process.env);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Pages are MDX files in content/, imported by the docs route; .mdx here lets them compile.
  pageExtensions: ["ts", "tsx", "mdx"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Plugins are named as strings: Turbopack runs MDX in Rust and can't receive functions.
const withMDX = createMDX({
  options: { remarkPlugins: ["remark-gfm"] },
});

// Points next-intl at the per-request language and messages.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(withMDX(nextConfig));
