import "server-only";

import type { MDXContent } from "mdx/types";

import type { Locale } from "@/i18n/routing";

import { PAGE_SLUGS, SECTIONS, type PageMeta, type SectionId } from "./pages";

export type DocPage = { slug: string; meta: PageMeta; Content: MDXContent };

/** A page's content and meta in one language. Only call it with a slug from PAGE_SLUGS. */
export async function loadPage(locale: Locale, slug: string): Promise<DocPage> {
  const page = (await import(`../../../content/${locale}/${slug}.mdx`)) as {
    default: MDXContent;
    meta: PageMeta;
  };
  return { slug, meta: page.meta, Content: page.default };
}

export type NavSection = { id: SectionId; pages: { slug: string; title: string }[] };

/** The navigation, with each page's title in the language. */
export async function loadNavigation(locale: Locale): Promise<NavSection[]> {
  const pages = await Promise.all(PAGE_SLUGS.map((slug) => loadPage(locale, slug)));
  const titles = new Map(pages.map((page) => [page.slug, page.meta.title]));
  return SECTIONS.map((section) => ({
    id: section.id,
    pages: section.pages.map((page) => {
      const slug = `${section.id}/${page}`;
      return { slug, title: titles.get(slug) ?? slug };
    }),
  }));
}
