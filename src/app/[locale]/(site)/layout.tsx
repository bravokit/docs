import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";

// Every page of the site: the header, the page, the footer. All of it is prerendered.
export default function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
