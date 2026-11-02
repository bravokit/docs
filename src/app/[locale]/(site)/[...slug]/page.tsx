import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { site } from "@/config/site";
import { EditionBadge } from "@/features/docs/components/edition-badge";
import { DocsMenu } from "@/features/docs/components/docs-menu";
import { DocsNav } from "@/features/docs/components/docs-nav";
import { loadNavigation, loadPage } from "@/features/docs/content";
import { EDITIONS, PAGE_SLUGS, isPageSlug } from "@/features/docs/pages";
import { getPathname, Link } from "@/i18n/navigation";
import { LANGUAGE_TAGS, routing, type Locale } from "@/i18n/routing";

// Every docs page, from content/<locale>/<slug>.mdx, prerendered in every language. Any other
// address renders the 404 page: this route also catches what matches nothing else.

export function generateStaticParams() {
  return PAGE_SLUGS.map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[...slug]">): Promise<Metadata> {
  const { locale, slug: parts } = await params;
  const slug = parts.join("/");
  if (!isPageSlug(slug)) {
    const t = await getTranslations("notFound");
    return { title: t("title") };
  }
  const { meta } = await loadPage(locale as Locale, slug);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((other) => [
          LANGUAGE_TAGS[other],
          getPathname({ href: `/${slug}`, locale: other }),
        ]),
      ),
    },
  };
}

// The page reads its URL inside Suspense, so the App Shell (header, footer, this grid) is shared
// by every docs link and a navigation paints at once. Prerendered pages still ship complete HTML.
export default function DocPage({ params }: PageProps<"/[locale]/[...slug]">) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <Suspense fallback={<DocSkeleton />}>
        <DocContent params={params} />
      </Suspense>
    </div>
  );
}

function DocSkeleton() {
  return (
    <div className="grid max-w-3xl animate-pulse content-start gap-3 lg:col-start-2">
      <div className="h-5 w-32 rounded-md bg-muted" />
      <div className="h-9 w-2/3 rounded-md bg-muted" />
      <div className="h-6 w-full rounded-md bg-muted" />
    </div>
  );
}

async function DocContent({ params }: Pick<PageProps<"/[locale]/[...slug]">, "params">) {
  const { locale: param, slug: parts } = await params;
  const slug = parts.join("/");
  if (!isPageSlug(slug)) notFound();
  const locale = param as Locale;

  const [{ meta, Content }, sections, t] = await Promise.all([
    loadPage(locale, slug),
    loadNavigation(locale),
    getTranslations("docs"),
  ]);
  const pages = sections.flatMap((section) => section.pages);
  const index = pages.findIndex((page) => page.slug === slug);
  const previous = pages[index - 1];
  const next = pages[index + 1];
  const checked = EDITIONS.filter((edition) => meta.checked[edition])
    .map((edition) => `${site.products[edition].name} ${meta.checked[edition]}`)
    .join(" · ");
  const nav = <DocsNav sections={sections} current={slug} />;

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8">{nav}</div>
      </aside>

      <article className="max-w-3xl min-w-0">
        <div className="mb-6 lg:hidden">
          <DocsMenu>{nav}</DocsMenu>
        </div>
        <header className="mb-8 grid gap-3 border-b pb-6">
          <div>
            <EditionBadge editions={meta.editions} />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{meta.title}</h1>
          <p className="text-lg text-muted-foreground">{meta.description}</p>
        </header>

        <Content />

        <footer className="mt-16 grid gap-6 border-t pt-6">
          <p className="text-xs text-muted-foreground">{t("checked", { versions: checked })}</p>
          <nav aria-label={t("pagerLabel")} className="grid gap-3 sm:grid-cols-2">
            {previous && (
              <Link
                href={`/${previous.slug}`}
                className="grid gap-1 rounded-lg border p-4 hover:bg-muted/50"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeftIcon className="size-3" /> {t("previous")}
                </span>
                <span className="font-medium">{previous.title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={`/${next.slug}`}
                className="grid gap-1 rounded-lg border p-4 text-right hover:bg-muted/50 sm:col-start-2"
              >
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  {t("next")} <ArrowRightIcon className="size-3" />
                </span>
                <span className="font-medium">{next.title}</span>
              </Link>
            )}
          </nav>
        </footer>
      </article>
    </>
  );
}
