"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

// next-themes renders an inline <script> that sets the theme class before the page paints. It only
// does anything in the server's HTML: when React later builds this part of the page in the browser
// (a 404, an error recovery, a dev-mode check), it creates the script as a new element, which never
// runs, and React logs "Encountered a script tag" for it. Outside hydration the script is marked
// as data (`text/plain`), which React leaves alone; the server HTML keeps the working script.
const DATA_ONLY = { type: "text/plain" } as const;

/** True while rendering on the server or hydrating its HTML; false once React renders on its own. */
function useIsHydrating() {
  return useSyncExternalStore(
    noSubscription,
    () => false,
    () => true,
  );
}

// Toggles the `dark` class on <html>, which switches every design token in globals.css.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const hydrating = useIsHydrating();
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={hydrating ? undefined : DATA_ONLY}
    >
      {children}
    </NextThemesProvider>
  );
}
