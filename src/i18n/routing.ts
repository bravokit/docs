import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, LOCALES } from "./locales";

// The languages come from locales.ts. A first visit follows the browser's language, and a cookie
// remembers a language the user picks.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** Names shown in the language switcher, each in its own language. */
export const LOCALE_NAMES: Record<Locale, string> = { en: "English", zh: "简体中文" };

/** The value for <html lang> and other places that want a full language tag. */
export const LANGUAGE_TAGS: Record<Locale, string> = { en: "en", zh: "zh-CN" };
