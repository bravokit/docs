import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";

import { loadMessages } from "./messages";
import { routing } from "./routing";

// The language and messages for server code. Pages read the language from the [locale] route
// segment, which keeps marketing pages prerendered. Server Actions can't read route segments, so
// they use the language the proxy found for the request (next-intl's `requestLocale`, which is
// deprecated for pages only). Code outside a request, like emails, passes it explicitly.
export default getRequestConfig(async ({ locale: requested, requestLocale }) => {
  const candidate = requested ?? (await routeLocale()) ?? (await requestLocale);
  const locale = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;
  return { locale, messages: await loadMessages(locale) };
});

async function routeLocale() {
  try {
    return await rootLocale();
  } catch {
    // Inside a Server Action, which throws (synchronously) instead of returning a value.
    return undefined;
  }
}
