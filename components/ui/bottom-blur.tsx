"use client";

import { useEffect, useState } from "react";

/**
 * A thin progressive blur along the bottom of the viewport, so content softens
 * as it scrolls out of view. Hidden at the very top (the hero buttons sit at
 * the bottom of the first screen) and at the very end (the footer's last line
 * stays sharp). Decorative only: it never takes clicks.
 */
export function BottomBlur() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const end = document.documentElement.scrollHeight - window.innerHeight;
      setShow(y > 80 && end - y > 48);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-show={show ? "" : undefined}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-12 opacity-0 transition-opacity duration-300 data-[show]:opacity-100 md:h-16"
    >
      {/* Two layers: a light blur over the whole band, a stronger one at the very edge. */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent)] backdrop-blur-[2px]" />
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,black,transparent_60%)] backdrop-blur-[6px]" />
    </div>
  );
}
