"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/**
 * The navigation on phones, in a sheet. The nav itself is rendered on the server and passed in;
 * choosing a page closes the sheet.
 */
export function DocsMenu({ children }: { children: React.ReactNode }) {
  const t = useTranslations("docs");
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <MenuIcon />
        {t("menu")}
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto p-4">
        <SheetTitle>{t("navLabel")}</SheetTitle>
        <div
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
