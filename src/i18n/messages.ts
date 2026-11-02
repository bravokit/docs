import type { Locale } from "./routing";

/**
 * The message files of each language, in src/i18n/messages/<locale>/<area>.json: the site's
 * interface text. Page content is in content/<locale>/, not here.
 */
export const MESSAGE_AREAS = ["core"] as const;

export type Messages = { [key: string]: string | Messages };

/**
 * The shape of every language's messages, from the English files of the areas above (list each
 * one here too).
 */
export type AppMessages = typeof import("./messages/en/core.json");

/** Merges message areas into one tree; a key defined twice is an error. */
export function mergeMessages(areas: Messages[], path = ""): Messages {
  const merged: Messages = {};
  for (const area of areas) {
    for (const [key, value] of Object.entries(area)) {
      const at = path ? `${path}.${key}` : key;
      const existing = merged[key];
      if (existing === undefined) {
        merged[key] = value;
      } else if (typeof existing === "object" && typeof value === "object") {
        merged[key] = mergeMessages([existing, value], at);
      } else {
        throw new Error(`The message "${at}" is defined in more than one area`);
      }
    }
  }
  return merged;
}

/** Every message of a language. */
export async function loadMessages(locale: Locale): Promise<AppMessages> {
  const areas = await Promise.all(
    MESSAGE_AREAS.map(
      async (area) => (await import(`./messages/${locale}/${area}.json`)).default as Messages,
    ),
  );
  // The test in ./messages.test.ts checks that every language has exactly these keys.
  return mergeMessages(areas) as AppMessages;
}
