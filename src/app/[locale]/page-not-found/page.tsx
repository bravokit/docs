import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

// Where the proxy sends addresses that are no page (src/proxy.ts). A page without params is
// prerendered as a 404 at build time, so the response is a real 404 in the visitor's language;
// the docs route's own notFound() would come after its shell had already answered 200.

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("title"), robots: { index: false } };
}

export default function PageNotFound() {
  notFound();
}
