import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="font-heading text-2xl font-semibold">{t("title")}</h1>
      <p className="max-w-sm text-muted-foreground">{t("body")}</p>
      <Link href="/" className={buttonVariants()}>
        {t("toHome")}
      </Link>
    </main>
  );
}
