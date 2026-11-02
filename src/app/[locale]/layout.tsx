import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/config/site";
import { LANGUAGE_TAGS, routing } from "@/i18n/routing";
import { env } from "@/lib/env";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Defaults for every page; pages override `title` and `description`. The share image and icon
// are served from src/app (opengraph-image.tsx, icon.svg), above this [locale] layout, so they're
// referenced here rather than picked up automatically.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");
  const description = t("description");
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: { default: site.name, template: `%s | ${site.name}` },
    description,
    applicationName: site.name,
    icons: { icon: { url: "/icon.svg", type: "image/svg+xml" } },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.name,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description,
      images: ["/opengraph-image"],
    },
  };
}

// Prerender every page in every language.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    // next-themes sets the theme class on <html> before hydration; this silences the
    // expected attribute mismatch on this one element only.
    <html
      lang={LANGUAGE_TAGS[locale]}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
