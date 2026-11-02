import { cn } from "cn";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import type { NavSection } from "../content";

/** Every page by section, with the current one marked. Shown beside pages and in the phone menu. */
export function DocsNav({ sections, current }: { sections: NavSection[]; current: string }) {
  const t = useTranslations("docs");
  return (
    <nav aria-label={t("navLabel")} className="grid gap-6 text-sm">
      {sections.map((section) => (
        <div key={section.id} className="grid gap-1">
          <p className="px-2 font-medium">{t(`sections.${section.id}`)}</p>
          <ul className="grid gap-0.5">
            {section.pages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/${page.slug}`}
                  aria-current={page.slug === current ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground",
                    page.slug === current && "bg-muted font-medium text-foreground",
                  )}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
