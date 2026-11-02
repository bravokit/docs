import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Locale-aware versions of Next.js's navigation APIs: links and router calls keep the current
// language prefix, and usePathname() returns the path without it. Client components use these
// instead of next/link and next/navigation. Server-side redirect() from next/navigation may use
// plain paths: the proxy adds the visitor's language.
export const { Link, usePathname, useRouter, getPathname } = createNavigation(routing);
