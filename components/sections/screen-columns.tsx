import Image, { type StaticImageData } from "next/image";
import { PlayWhenVisible } from "@/components/ui/play-when-visible";
import aura from "@/public/images/gallery/aura.jpg";
import beyondFitness from "@/public/images/gallery/beyond-fitness.jpg";
import fedtc from "@/public/images/gallery/fedtc.jpg";
import lavax from "@/public/images/gallery/lavax.jpg";
import staffos from "@/public/images/gallery/staffos.jpg";
import deultimateVentures from "@/public/images/work/deultimate-ventures.jpg";
import domesticStaffingHub from "@/public/images/work/domestic-staffing-hub.jpg";
import eliteLearning from "@/public/images/work/elite-learning-innovations.jpg";
import zomariLuxe from "@/public/images/work/zomari-luxe-cleaning.jpg";

// Decoration, not the portfolio: our own client sites and concept builds, unlabeled.
// Named client work lives in the Work section and its case studies.
const columns: {
  shots: StaticImageData[];
  reverse?: boolean;
  seconds: number;
}[] = [
  {
    shots: [eliteLearning, beyondFitness, zomariLuxe, staffos, aura],
    seconds: 48,
  },
  {
    shots: [
      domesticStaffingHub,
      lavax,
      deultimateVentures,
      fedtc,
      beyondFitness,
    ],
    reverse: true,
    seconds: 54,
  },
];

/**
 * Two columns of landing pages, one drifting up and one down, behind the dark
 * bento card. Fades and a progressive blur at the top and bottom leave the
 * middle band sharp, where the eye lands. Paused off screen and on hover;
 * still under reduced motion.
 */
export function ScreenColumns() {
  return (
    <div aria-hidden className="absolute inset-0">
      <PlayWhenVisible className="absolute inset-0 grid grid-cols-2 gap-3 px-3 md:gap-4 md:px-4">
        {columns.map((col, c) => (
          <div key={c} className="relative overflow-hidden">
            <div
              data-reverse={col.reverse ? "" : undefined}
              style={{ animationDuration: `${col.seconds}s` }}
              className="marquee-col flex flex-col gap-3 md:gap-4"
            >
              {/* The set twice: the column slides by exactly one set, then loops. */}
              {[...col.shots, ...col.shots].map((shot, i) => (
                <div
                  key={i}
                  className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-md ring-1 ring-white/10"
                >
                  <Image
                    src={shot}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 280px, 46vw"
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </PlayWhenVisible>

      {/* Top: a short fade and blur so the columns enter from soft focus. */}
      <div className="from-neutral-darkest absolute inset-x-0 top-0 h-1/4 bg-linear-to-b to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1/4 [mask-image:linear-gradient(to_bottom,black,transparent)] backdrop-blur-md" />

      {/* Bottom: a deep fade and blur that the headline sits on. */}
      <div className="from-neutral-darkest via-neutral-darkest/90 absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 [mask-image:linear-gradient(to_top,black_45%,transparent)] backdrop-blur-lg" />
    </div>
  );
}
