"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

function useToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  return () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
}

export function ThemeToggle() {
  const t = useTranslations("common");
  const toggle = useToggleTheme();

  return (
    <Button variant="ghost" size="icon" aria-label={t("toggleTheme")} onClick={toggle}>
      {/* Icons switch on the `dark` class via CSS, so the server render never mismatches. */}
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  );
}

/** The same toggle as an item of another menu: the account menu on phones. */
export function ThemeMenuItem() {
  const t = useTranslations("common");
  const toggle = useToggleTheme();

  return (
    <DropdownMenuItem onClick={toggle}>
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
      {t("toggleTheme")}
    </DropdownMenuItem>
  );
}
