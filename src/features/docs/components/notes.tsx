import { cn } from "cn";
import { InfoIcon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// Callouts for pages, available in every MDX file without an import (src/mdx-components.tsx):
// <Note>, <Warning>, and <ProNote> for what differs in Kitewell Pro on a page about both
// editions.

function Callout({
  label,
  icon,
  className,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <aside
      aria-label={label}
      className={cn("my-6 flex gap-3 rounded-lg border p-4 text-sm [&_p]:my-0", className)}
    >
      <span className="mt-0.5 shrink-0 [&_svg]:size-4" aria-hidden>
        {icon}
      </span>
      <div className="grid min-w-0 gap-2">
        <p className="font-medium">{label}</p>
        {children}
      </div>
    </aside>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  const t = useTranslations("docs.notes");
  return (
    <Callout label={t("note")} icon={<InfoIcon />} className="bg-muted/50">
      {children}
    </Callout>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  const t = useTranslations("docs.notes");
  return (
    <Callout
      label={t("warning")}
      icon={<TriangleAlertIcon />}
      className="border-destructive/40 bg-destructive/5"
    >
      {children}
    </Callout>
  );
}

export function ProNote({ children }: { children: React.ReactNode }) {
  const t = useTranslations("docs.notes");
  return (
    <Callout label={t("pro")} icon={<SparklesIcon />} className="border-primary/30 bg-primary/5">
      {children}
    </Callout>
  );
}
