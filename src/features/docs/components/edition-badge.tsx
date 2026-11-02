import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import type { Edition } from "../pages";

/** Which editions a page applies to, at the top of every page. */
export function EditionBadge({ editions }: { editions: Edition[] }) {
  const t = useTranslations("docs.editions");
  const proOnly = editions.length === 1 && editions[0] === "pro";
  return (
    <Badge variant={proOnly ? "default" : "secondary"}>{proOnly ? t("pro") : t("both")}</Badge>
  );
}
