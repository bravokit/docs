import { expect, test, type Page } from "@playwright/test";

import { PAGE_SLUGS } from "../src/features/docs/pages";

// Every page in every language opens cleanly, at desktop and phone width (the two projects in
// playwright.config.ts), in light and dark mode.

const LOCALES = [
  { locale: "en", prefix: "" },
  { locale: "zh", prefix: "/zh" },
];

/** Collects console errors and failed page loads from here on. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function expectNoSidewaysScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

for (const { locale, prefix } of LOCALES) {
  for (const slug of PAGE_SLUGS) {
    test(`${locale}: /${slug} opens cleanly`, async ({ page }) => {
      const errors = watchErrors(page);
      const response = await page.goto(`${prefix}/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expectNoSidewaysScroll(page);

      await page.emulateMedia({ colorScheme: "dark" });
      await page.reload();
      await expect(page.locator("html")).toHaveClass(/dark/);
      await expectNoSidewaysScroll(page);
      expect(errors).toEqual([]);
    });
  }

  test(`${locale}: the home page opens cleanly`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(prefix || "/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoSidewaysScroll(page);
    expect(errors).toEqual([]);
  });

  test(`${locale}: an unknown address is a 404 in the same language`, async ({ page }) => {
    const response = await page.goto(`${prefix}/start/no-such-page`);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en");
    await expect(page.getByText("404", { exact: true })).toBeVisible();
  });
}

test("a reader finds every page from the navigation", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start with the quick start" }).click();
  await expect(page).toHaveURL(/\/start\/quick-start$/);
  await expect(page.getByRole("heading", { level: 1, name: "Quick start" })).toBeVisible();

  // On phones the navigation is in a menu that closes when a page is chosen.
  const openNav = async () => {
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    return page.getByRole("navigation", { name: "Documentation" }).filter({ visible: true });
  };
  for (const slug of PAGE_SLUGS) {
    await (await openNav()).locator(`a[href="/${slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${slug}$`));
    await expect((await openNav()).locator(`a[href="/${slug}"]`)).toHaveAttribute(
      "aria-current",
      "page",
    );
    if (isMobile) await page.keyboard.press("Escape");
  }
});

test("switching language keeps the page", async ({ page }) => {
  await page.goto("/start/quick-start");
  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitemradio", { name: "简体中文" }).click();
  await expect(page).toHaveURL(/\/zh\/start\/quick-start$/);
  await expect(page.getByRole("heading", { level: 1, name: "快速开始" })).toBeVisible();
});

test("a Pro-only page says so, and a shared page says both", async ({ page }) => {
  await page.goto("/pro/modules");
  await expect(page.locator("article header")).toContainText("Pro");
  await expect(page.locator("article header")).not.toContainText("Kitewell and Pro");
  await page.goto("/start/introduction");
  await expect(page.locator("article header")).toContainText("Kitewell and Pro");
});
