import Image from "next/image";
import Link from "next/link";
import symbol from "@/public/brand/pagewell-symbol.svg";

/**
 * Company symbol + wordmark, linking home. The wordmark is real text, not an
 * image. Lockup: the word is set at the symbol's height (32px) with its
 * baseline on the symbol's bottom edge, so the capitals reach about three
 * quarters of the way up and only the "g" hangs below, instead of the word
 * floating at the symbol's middle. The "g" overhang is pulled back out of
 * the layout (-mb-[0.16em]) so the nav still centres the symbol itself.
 *
 * On narrow screens (where the navbar shows its menu icon) the wordmark folds
 * away while the navbar is holding the "Contact us" button, leaving just the
 * symbol so the bar has room to breathe; it returns when the button leaves.
 */
export function BrandLogo() {
  return (
    <Link
      href="/"
      className="text-neutral-darkest flex items-baseline rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <Image src={symbol} alt="" width={32} height={32} priority />
      {/* Clip sideways only (for the fold-away); overflow-hidden here cut off the "g". */}
      <span className="-mb-[0.16em] ml-2 max-w-44 overflow-x-clip text-[2rem] leading-none font-semibold tracking-tight whitespace-nowrap transition-[max-width,margin,opacity] duration-300 ease-in-out motion-reduce:transition-none @max-2xl/handoff-nav:group-data-[caught=true]/handoff-nav:ml-0 @max-2xl/handoff-nav:group-data-[caught=true]/handoff-nav:max-w-0 @max-2xl/handoff-nav:group-data-[caught=true]/handoff-nav:opacity-0">
        Pagewell
      </span>
    </Link>
  );
}
