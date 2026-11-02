import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { MESSAGE_AREAS, mergeMessages, type Messages } from "./messages";
import { routing } from "./routing";

function readMessages(locale: string): Messages {
  const areas = MESSAGE_AREAS.map(
    (area) =>
      JSON.parse(
        readFileSync(path.join(import.meta.dirname, "messages", locale, `${area}.json`), "utf8"),
      ) as Messages,
  );
  // Throws when two areas define the same key.
  return mergeMessages(areas);
}

/** Every message as "namespace.key" -> text. */
function flatten(messages: Messages, prefix = ""): Map<string, string> {
  const entries = new Map<string, string>();
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") entries.set(path, value);
    else for (const [nested, text] of flatten(value, path)) entries.set(nested, text);
  }
  return entries;
}

/** The values a message expects ({name}, {count, plural, ...}) and its rich-text tags. */
function slots(text: string): string[] {
  const found = new Set<string>();
  collect(text, found);
  for (const match of text.matchAll(/<(\w+)>/g)) found.add(`<${match[1]}>`);
  return [...found].sort();
}

/** Adds the argument names in ICU message text, looking inside select and plural branches. */
function collect(text: string, found: Set<string>) {
  let index = 0;
  while ((index = text.indexOf("{", index)) !== -1) {
    const close = matchingBrace(text, index);
    const [name = "", type = "", ...rest] = text.slice(index + 1, close).split(",");
    found.add(name.trim());
    if (["select", "plural", "selectordinal"].includes(type.trim())) {
      // Branches look like `key {text}`; only their bodies hold more arguments.
      const branches = rest.join(",");
      let at = 0;
      while ((at = branches.indexOf("{", at)) !== -1) {
        const end = matchingBrace(branches, at);
        collect(branches.slice(at + 1, end), found);
        at = end + 1;
      }
    }
    index = close + 1;
  }
}

function matchingBrace(text: string, open: number): number {
  let depth = 0;
  for (let index = open; index < text.length; index++) {
    if (text[index] === "{") depth++;
    if (text[index] === "}" && --depth === 0) return index;
  }
  throw new Error(`Unbalanced braces in "${text}"`);
}

const english = flatten(readMessages("en"));
const translations = Object.fromEntries(
  routing.locales
    .filter((locale) => locale !== "en")
    .map((locale) => [locale, flatten(readMessages(locale))]),
);

describe.each(Object.entries(translations))("%s messages", (_locale, translated) => {
  it("have exactly the English keys", () => {
    expect([...translated.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it("use the same values and tags as English", () => {
    for (const [key, text] of english) {
      expect({ key, slots: slots(translated.get(key) ?? "") }).toEqual({ key, slots: slots(text) });
    }
  });

  it("are translated (no empty strings)", () => {
    for (const [key, text] of translated)
      expect({ key, text: text.trim() !== "" }).toEqual({ key, text: true });
  });
});

describe("mergeMessages", () => {
  it("combines areas that share a namespace", () => {
    expect(
      mergeMessages([{ account: { title: "A" } }, { account: { email: { title: "B" } } }]),
    ).toEqual({ account: { title: "A", email: { title: "B" } } });
  });

  it("refuses a key defined in two areas", () => {
    expect(() => mergeMessages([{ account: { title: "A" } }, { account: { title: "B" } }])).toThrow(
      'The message "account.title" is defined in more than one area',
    );
  });
});
