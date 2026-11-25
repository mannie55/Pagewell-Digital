import { HandoffNav } from "@/components/ui/handoff-nav";
import { mainNav } from "@/lib/site";
import { BrandLogo } from "./brand-logo";

/**
 * Site navbar. Full-width at the top of the page; after a short scroll it
 * tightens into a floating bar and catches the page's "Contact us" button (the hero's, or the page header's).
 */
export function SiteHeader() {
  return (
    <HandoffNav
      className="[--handoff-nav-width:95rem]"
      links={[...mainNav]}
      logo={<BrandLogo />}
    />
  );
}
