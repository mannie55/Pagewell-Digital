"use client";

import dynamic from "next/dynamic";
import { useNearViewport } from "@/lib/use-near-viewport";

const Seam = dynamic(() => import("@/components/ui/seam").then((m) => m.Seam), {
  ssr: false,
});

/** Still dotted edge from the white page into the dark Work band; drawn when near. */
export function SectionSeam() {
  const { ref, near } = useNearViewport<HTMLDivElement>({ margin: "600px" });
  return (
    <div
      ref={ref}
      aria-hidden
      className="to-neutral-darker h-28 bg-linear-to-b from-white from-50% to-50% md:h-40"
    >
      {near ? (
        <Seam
          pattern="dots"
          progress={0.5}
          fromClassName="text-white"
          toClassName="text-neutral-darker"
          className="h-28 md:h-40"
        />
      ) : null}
    </div>
  );
}
