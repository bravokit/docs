// Every page of the site, in navigation order. A page is content/<locale>/<section>/<page>.mdx in
// every language; adding one means writing those files and adding its name here. The tests in
// ./content.test.ts check both directions. No imports, so Playwright and the tests can read it.

export const EDITIONS = ["kitewell", "pro"] as const;
export type Edition = (typeof EDITIONS)[number];

/** What every page exports as `meta`, checked by the tests. */
export type PageMeta = {
  title: string;
  /** One or two sentences: what the reader has at the end. Also the search description. */
  description: string;
  /** The editions the page applies to: ["kitewell", "pro"] for both, ["pro"] for Pro only. */
  editions: Edition[];
  /** The release of each edition above that the page was last checked against, e.g. "1.0.0". */
  checked: Partial<Record<Edition, string>>;
};

export const SECTIONS = [
  {
    id: "start",
    pages: ["introduction", "choosing-an-edition", "quick-start", "project-structure"],
  },
  { id: "pro", pages: ["modules"] },
  { id: "reference", pages: ["commands"] },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Every page's slug ("start/quick-start"), in navigation order. */
export const PAGE_SLUGS: string[] = SECTIONS.flatMap((section) =>
  section.pages.map((page) => `${section.id}/${page}`),
);

export function isPageSlug(slug: string): boolean {
  return PAGE_SLUGS.includes(slug);
}
