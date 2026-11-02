"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_NAMES, routing, type Locale } from "@/i18n/routing";

/**
 * Switches the page to another language, keeping the path and query. next-intl stores the choice
 * in a cookie, so later visits and plain-path redirects stay in that language.
 */
export function LanguageSwitcher({ onChange }: { onChange?: (locale: Locale) => void }) {
  const t = useTranslations("common");
  const trigger = <Button variant="ghost" size="icon" aria-label={t("language")} />;
  return (
    // The current path and query are request data: keep layouts that use this prerenderable.
    <Suspense
      fallback={
        <Button variant="ghost" size="icon" aria-label={t("language")} disabled>
          <LanguagesIcon />
        </Button>
      }
    >
      <Menu trigger={trigger} onChange={onChange} />
    </Suspense>
  );
}

function Menu({
  trigger,
  onChange,
}: {
  trigger: React.ReactElement;
  onChange?: (locale: Locale) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger}>
        <LanguagesIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <LanguageRadioItems onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * The languages as radio items, for a menu that has other items too (the account menu on
 * phones). Reads the current path and query, so render it inside <Suspense>.
 */
export function LanguageRadioItems({ onChange }: { onChange?: (locale: Locale) => void }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams().toString();

  function choose(next: string) {
    const target = next as Locale;
    router.replace(query ? `${pathname}?${query}` : pathname, { locale: target });
    onChange?.(target);
  }

  return (
    <DropdownMenuRadioGroup value={locale} onValueChange={choose}>
      {routing.locales.map((option) => (
        <DropdownMenuRadioItem key={option} value={option} lang={option}>
          {LOCALE_NAMES[option]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
