"use client";

import dynamic from "next/dynamic";
import { useNearViewport } from "@/lib/use-near-viewport";

// Decorative and below the fold: its code loads only when the card is near.
const AutomationDiagram = dynamic(
  () => import("./automation-diagram").then((m) => m.AutomationDiagram),
  { ssr: false },
);

/** Email / CRM / Google feeding "AI automation". Signals run only while it is on screen. */
export function AutomationIllustration() {
  const { ref: nearRef, near: isNear } = useNearViewport<HTMLDivElement>({
    margin: "500px",
  });
  const { ref: visibleRef, near: isVisible } = useNearViewport<HTMLDivElement>({
    margin: "0px",
    once: false,
  });

  return (
    <div
      ref={nearRef}
      aria-hidden
      data-nosnippet
      className="h-[14.5rem] shrink-0"
    >
      <div ref={visibleRef} className="h-full">
        {isNear ? <AutomationDiagram playing={isVisible} /> : null}
      </div>
    </div>
  );
}
