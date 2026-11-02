import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/config/site";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");
  return { title: { absolute: site.name }, description: t("description") };
}

// Where the docs start: what the two editions are, and the first pages to read.
const PATHS = [
  { key: "introduction", href: "/start/introduction" },
  { key: "choosing", href: "/start/choosing-an-edition" },
  { key: "quickStart", href: "/start/quick-start" },
  { key: "modules", href: "/pro/modules" },
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 sm:py-24">
      <section className="grid max-w-2xl gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("lead")}</p>
        <div>
          <Link href="/start/quick-start" className={buttonVariants({ size: "lg" })}>
            {t("start")} <ArrowRightIcon />
          </Link>
        </div>
      </section>

      <section aria-label={t("pathsLabel")} className="grid gap-4 sm:grid-cols-2">
        {PATHS.map((path) => (
          <Link
            key={path.key}
            href={path.href}
            className="grid gap-1 rounded-xl border p-5 transition-colors hover:bg-muted/50"
          >
            <span className="font-medium">{t(`paths.${path.key}.title`)}</span>
            <span className="text-sm text-muted-foreground">{t(`paths.${path.key}.body`)}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
