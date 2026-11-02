import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/config/site";
import { PAGE_SLUGS } from "@/features/docs/pages";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="font-heading font-semibold">
          {site.name}
        </Link>
        <nav aria-label={t("label")} className="hidden items-center gap-4 text-sm sm:flex">
          <Link href={`/${PAGE_SLUGS[0]}`} className="text-muted-foreground hover:text-foreground">
            {t("docs")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <a
            href={site.products.kitewell.repository}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {t("github")}
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
