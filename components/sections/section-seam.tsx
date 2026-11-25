/**
 * Dotted edge from the white page into the dark Work band.
 * A static SVG (public/images/seam-dots.svg, tiles on x) instead of the canvas
 * Seam: same halftone front, no JavaScript and no animation loop.
 */
export function SectionSeam() {
  return (
    <div
      aria-hidden
      className="h-28 bg-white bg-[url(/images/seam-dots.svg)] bg-size-[auto_100%] bg-bottom-left bg-repeat-x md:h-40"
    />
  );
}
