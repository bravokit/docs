import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

import { site } from "@/config/site";
import { routing } from "@/i18n/routing";

// The preview shown when a page is shared on social networks and in chat apps. Generated at
// build time from the site config, so it follows a rebrand automatically. One image for every
// language, in the default one: the image renderer's built-in font has no Chinese characters.
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "site" });
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 600 }}
      >
        <svg width="56" height="56" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="7" fill="#fafafa" />
          <path d="M16 5 25 15 16 27 7 15Z" fill="#0a0a0a" />
        </svg>
        {site.name}
      </div>
      <div
        style={{ display: "flex", fontSize: 68, fontWeight: 600, lineHeight: 1.1, maxWidth: 980 }}
      >
        {t("tagline")}
      </div>
    </div>,
    size,
  );
}
