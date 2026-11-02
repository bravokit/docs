import { useTranslations } from "next-intl";

import { site } from "@/config/site";

export function SiteFooter() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {site.company}</p>
        <p>{t("builtWith", { product: site.products.kitewell.name })}</p>
      </div>
    </footer>
  );
}
