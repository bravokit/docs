import type { MetadataRoute } from "next";

import { PAGE_SLUGS } from "@/features/docs/pages";
import { getPathname } from "@/i18n/navigation";
import { LANGUAGE_TAGS, routing } from "@/i18n/routing";
import { env } from "@/lib/env";

// Every page in every language, with links to its translations: the home page and each page in
// src/features/docs/pages.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (href: string, locale: string) =>
    new URL(getPathname({ href, locale }), env.NEXT_PUBLIC_APP_URL).toString();

  return ["/", ...PAGE_SLUGS.map((slug) => `/${slug}`)].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: url(path, locale),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((other) => [LANGUAGE_TAGS[other], url(path, other)]),
        ),
      },
    })),
  );
}
