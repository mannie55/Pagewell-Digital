"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
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
 * the final value before the roll.
 */
export function StatNumber({ value }: { value: number }) {
  const { ref, near } = useNearViewport<HTMLSpanElement>({ margin: "0px" });
  // False in the server HTML, true once scripts are running in the browser.
  const armed = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <span ref={ref} className="inline-grid">
      {/* Holds the number's exact space, so nothing jumps while the counter loads. */}
      <span
        data-reveal
        aria-hidden={near || undefined}
        className={cn(
          "col-start-1 row-start-1 tabular-nums",
          armed && "opacity-0",
        )}
      >
        {value}
      </span>
      {near ? (
        <span className="col-start-1 row-start-1">
          <Odometer value={value} rollOnView />
        </span>
      ) : null}
    </span>
  );
}
