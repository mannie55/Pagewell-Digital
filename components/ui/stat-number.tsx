"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { useMedia } from "@/lib/use-media";
import { useNearViewport } from "@/lib/use-near-viewport";

const Odometer = dynamic(
  () => import("@/components/ui/odometer").then((m) => m.Odometer),
  { ssr: false },
);

/**
 * A stat that rolls up when it scrolls into view. The server HTML carries the
 * plain number (for search engines and no-JS). The rolling counter's code loads
 * only when the number itself reaches the screen, so it never slows the first
 * paint; until then the plain number waits invisibly so there is no flash of
 * the final value before the roll. Phones skip the roll and show the plain
 * number at once: waiting for it on scroll felt slow on a small screen.
 */
export function StatNumber({ value }: { value: number }) {
  const { ref, near } = useNearViewport<HTMLSpanElement>({ margin: "0px" });
  // Rolls only from 768px up, once scripts run (undefined in the server HTML).
  const armed = useMedia("(min-width: 48rem)") === true;
  const rolling = armed && near;

  return (
    <span ref={ref} className="inline-grid">
      {/* Holds the number's exact space, so nothing jumps while the counter loads. */}
      <span
        data-reveal
        aria-hidden={rolling || undefined}
        className={cn(
          "col-start-1 row-start-1 tabular-nums",
          armed && "opacity-0",
        )}
      >
        {value}
      </span>
      {rolling ? (
        <span className="col-start-1 row-start-1">
          <Odometer value={value} rollOnView />
        </span>
      ) : null}
    </span>
  );
}
