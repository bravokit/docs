import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

import { EDITIONS, PAGE_SLUGS, type PageMeta } from "./pages";

// The rules every page follows (CLAUDE.md, "Every page" and "Languages"), checked on the files
// themselves: a page that breaks one fails here rather than on the live site.

const CONTENT = path.join(import.meta.dirname, "../../../content");

function source(locale: string, slug: string) {
  return readFileSync(path.join(CONTENT, locale, `${slug}.mdx`), "utf8");
}

/** Every .mdx file under a language's folder, as slugs. */
function filesOf(locale: string, dir = ""): string[] {
  return readdirSync(path.join(CONTENT, locale, dir), { withFileTypes: true }).flatMap((entry) => {
    const relative = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return filesOf(locale, relative);
    return entry.name.endsWith(".mdx") ? [relative.slice(0, -".mdx".length)] : [];
  });
}

/** The page compiled as the site compiles it, for its exports. */
async function metaOf(locale: string, slug: string) {
  const page = await evaluate(source(locale, slug), { ...runtime, remarkPlugins: [remarkGfm] });
  return page.meta as PageMeta;
}

/**
 * What must match between languages: heading levels, code blocks and callouts, in order. A
 * `text` block (a folder tree with notes) may be translated, line for line; commands and code
 * may not.
 */
function structure(text: string) {
  const codeBlocks = [...text.matchAll(/^```([^\n]*)\n([\s\S]*?)^```/gm)].map(([, lang, code]) =>
    lang === "text" ? `text block of ${code.split("\n").length} lines` : code,
  );
  const prose = text.replace(/^```[^\n]*\n[\s\S]*?^```/gm, "");
  return {
    headings: [...prose.matchAll(/^(#{2,6}) /gm)].map((match) => match[1]),
    codeBlocks,
    callouts: [...prose.matchAll(/<(Note|Warning|ProNote)>/g)].map((match) => match[1]),
  };
}

const pages = routing.locales.flatMap((locale) => PAGE_SLUGS.map((slug) => ({ locale, slug })));

describe("the page list", () => {
  it.each(routing.locales)("matches the files in content/%s", (locale) => {
    expect(filesOf(locale).sort()).toEqual([...PAGE_SLUGS].sort());
  });
});

describe.each(pages)("$locale/$slug", ({ locale, slug }) => {
  it("compiles and has complete meta", async () => {
    const meta = await metaOf(locale, slug);
    expect(meta.title?.trim()).toBeTruthy();
    expect(meta.description?.trim()).toBeTruthy();
    expect(meta.editions.length).toBeGreaterThan(0);
    expect(meta.editions.every((edition) => EDITIONS.includes(edition))).toBe(true);
    // A version for exactly the editions the page covers.
    expect(Object.keys(meta.checked).sort()).toEqual([...meta.editions].sort());
    for (const version of Object.values(meta.checked)) expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("starts its headings at level 2 (the title is the page's only h1)", () => {
    const prose = source(locale, slug).replace(/^```[^\n]*\n[\s\S]*?^```/gm, "");
    expect(prose).not.toMatch(/^# /m);
  });

  // Text right inside a tag is JSX, which Prettier rewraps; a line break inside a Chinese
  // sentence then shows as a space. With blank lines around it, it's Markdown, left as written.
  it("puts Markdown, not JSX text, inside callouts", () => {
    expect(source(locale, slug)).not.toMatch(/<(Note|Warning|ProNote)>\n(?!\n)/);
  });

  it("links only to pages that exist", () => {
    const links = [...source(locale, slug).matchAll(/\]\((\/[^)\s#]*)/g)].map((match) => match[1]);
    for (const link of links) {
      expect({ link, exists: link === "/" || PAGE_SLUGS.includes(link.slice(1)) }).toEqual({
        link,
        exists: true,
      });
    }
  });
});

describe.each(routing.locales.filter((locale) => locale !== routing.defaultLocale))(
  "%s translations",
  (locale) => {
    it.each(PAGE_SLUGS)("%s has the English page's structure and meta", async (slug) => {
      expect(structure(source(locale, slug))).toEqual(
        structure(source(routing.defaultLocale, slug)),
      );
      const [translated, english] = await Promise.all([
        metaOf(locale, slug),
        metaOf(routing.defaultLocale, slug),
      ]);
      expect({ editions: translated.editions, checked: translated.checked }).toEqual({
        editions: english.editions,
        checked: english.checked,
      });
    });
  },
);
