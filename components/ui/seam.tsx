"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Keep:
 * - The front is painted on one canvas by one rAF loop that stops once the spring settles; scroll
 *   never re-renders React.
 * - Cells are whole pixels and the rows are anchored to the band's bottom, so full cells meet edge
 *   to edge and the band meets the next section exactly.
 * - The top and bottom `edgeRows` are pinned to their section's color, so neither edge of the band
 *   shows a line.
 * - Mounting, resizing and coming back on screen snap the front to the scroll position instead of
 *   springing to it.
 * - Under reduced motion the front skips the spring and sits exactly where the scroll puts it.
 */
const TIMING = {
  /** The spring the front rides as it follows scroll (the `stiffness` and `damping` props). */
  front: { stiffness: 120, damping: 30, mass: 0.4 },
} as const;

/* ─────────────────────────────────────────────────────────
 * SEAM STORYBOARD
 *
 *  rest      a band between two sections, printed as a grid of
 *            cells. The top row is all the section above, the
 *            bottom row all the section below, and a ragged front
 *            of half-filled cells runs between them, so neither
 *            edge of the band shows a line
 *  scroll    the front follows the band through its scrollport.
 *            When the band comes up from the bottom of the screen
 *            the section above still holds most of it; as it rises
 *            the color below climbs into it cell by cell, and by
 *            the time it leaves at the top the lower section has
 *            taken it over. The next section reaches up to meet
 *            the reader instead of starting at a hard edge
 *  smooth    the front rides a scroll-smoothing spring (stiffness
 *            120, damping 30, mass 0.4), so a wheel tick glides
 *            instead of stepping
 *  grain     the front is ragged, not a ruled line: each cell's
 *            threshold is shifted by low-frequency noise plus a
 *            little jitter of its own, so the lower color creeps
 *            up in tongues, like ink wicking into paper
 *  patterns  `dots` and `squares` grow by area like a halftone;
 *            `dither` switches whole cells on and off through a
 *            4 × 4 ordered matrix, like an old pixel dissolve
 *  colors    with no classes it reads the background of the
 *            element above and the element below, so it matches
 *            the two sections it sits between and follows them
 *            into dark mode
 *  progress  pass `progress` (0–1) to hold or drive the front
 *            yourself; the scrollport is ignored
 *  reduced   the same mapping to scroll, without the spring: the
 *            front sits exactly where the scroll puts it
 * ───────────────────────────────────────────────────────── */

const SEAM = {
  ramp: 1, // share of the band height the front's half-filled cells span
  noise: 0.5, // share of the band height the front wanders at `grain` 1
  jitter: 0.3, // share of `noise` that is each cell's own, the rest is shared with its neighbours
  noiseScale: [7, 2.5], // cells per noise period, across and down
  edgeRows: 2.5, // rows over which the top and bottom edges are pinned to their section
  minFill: 0.02, // cells under this fill draw nothing
  grout: 3, // px, the narrowest gap a halftone square leaves before it fills its cell
  maxDpr: 2,
} as const;

// 4 × 4 Bayer matrix, as thresholds in (0, 1).
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (b) => (b + 0.5) / 16,
);

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** A stable 0–1 value per integer lattice point. */
function hash(x: number, y: number, seed: number) {
  let h =
    (Math.imul(x, 374761393) +
      Math.imul(y, 668265263) +
      Math.imul(seed, 1442695041)) |
    0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

/** Smooth value noise in (-1, 1). */
function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const fx = x - xi;
  const fy = y - yi;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}

function isTransparent(color: string) {
  return (
    color === "transparent" ||
    /rgba?\([^)]*,\s*0\)$/.test(color) ||
    /\/\s*0\)$/.test(color)
  );
}

/** The first opaque background at or above `el`. */
function backgroundOf(el: Element | null) {
  for (let node = el; node; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor;
    if (!isTransparent(color)) return color;
  }
  return null;
}

function scrollParent(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    )
      return node;
  }
  return null;
}

export type SeamPattern = "dots" | "squares" | "dither";

type Options = {
  pattern: SeamPattern;
  cell: number;
  grain: number;
  progress: number | undefined;
  seed: number;
  stiffness: number;
  damping: number;
  reduced: boolean;
};

function createSeam() {
  let root: HTMLElement | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let probes: { from: HTMLElement | null; to: HTMLElement | null } = {
    from: null,
    to: null,
  };
  let scroller: HTMLElement | null = null;
  let options: Options = {
    pattern: "dots",
    cell: 12,
    grain: 0.6,
    progress: undefined,
    seed: 1,
    stiffness: TIMING.front.stiffness,
    damping: TIMING.front.damping,
    reduced: false,
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cols = 0;
  let rows = 0;
  let x0 = 0;
  let y0 = 0;
  let offsets = new Float32Array(0);
  let colors = { from: "#ffffff", to: "#09090b" };

  let target = 0;
  let front = 0;
  let velocity = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  const cleanups: (() => void)[] = [];

  function readColors() {
    if (!root) return;
    const above = probes.from
      ? getComputedStyle(probes.from).color
      : backgroundOf(root.previousElementSibling);
    const below = probes.to
      ? getComputedStyle(probes.to).color
      : backgroundOf(root.nextElementSibling);
    const page = backgroundOf(root.parentElement) ?? "#ffffff";
    colors = { from: above ?? page, to: below ?? getComputedStyle(root).color };
  }

  function layout() {
    if (!root || !canvas || !ctx) return;
    const rect = root.getBoundingClientRect();
    const nextDpr = Math.min(window.devicePixelRatio || 1, SEAM.maxDpr);
    width = rect.width;
    height = rect.height;
    dpr = nextDpr;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));

    const cell = Math.max(4, Math.round(options.cell));
    cols = Math.ceil(width / cell) + 1;
    rows = Math.ceil(height / cell);
    // Centre the columns; anchor the rows to the bottom, where the band must meet the next section exactly.
    x0 = Math.round((width - cols * cell) / 2);
    y0 = Math.round(height - rows * cell);

    offsets = new Float32Array(cols * rows);
    const [sx, sy] = SEAM.noiseScale;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const shared = noise(i / sx, j / sy, options.seed);
        const own = hash(i, j, options.seed + 7) * 2 - 1;
        offsets[j * cols + i] = shared * (1 - SEAM.jitter) + own * SEAM.jitter;
      }
    }
    scroller = scrollParent(root);
  }

  /** Where the band sits in its scrollport: 0 entering at the bottom, 1 leaving at the top. */
  function measure() {
    if (options.progress !== undefined) return clamp01(options.progress);
    if (!root) return 0;
    const rect = root.getBoundingClientRect();
    let top = 0;
    let bottom = window.innerHeight;
    if (scroller) {
      const port = scroller.getBoundingClientRect();
      top = port.top;
      bottom = port.bottom;
    }
    return clamp01((bottom - rect.top) / (bottom - top + rect.height));
  }

  function draw() {
    if (!ctx || !canvas || width === 0) return;
    // Whole pixels, so full cells meet edge to edge with no antialiased seam between them.
    const cell = Math.max(4, Math.round(options.cell));
    const amp = SEAM.noise * options.grain;
    const ramp = SEAM.ramp;
    // The front's centre, from below the band (nothing climbed yet) to above it (all climbed).
    const reach = ramp / 2 + amp;
    const at = 1 + reach - front * (1 + 2 * reach);
    const edge = SEAM.edgeRows / rows;
    const dither = options.pattern === "dither";
    const dots = options.pattern === "dots";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = colors.from;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = colors.to;
    ctx.beginPath();
    for (let j = 0; j < rows; j++) {
      const cy = y0 + (j + 0.5) * cell;
      const v = cy / height;
      const pinTop = smoothstep(0, edge, v - 0.5 / rows);
      const pinBottom = smoothstep(0, edge, 1 - v - 0.5 / rows);
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        let fill = smoothstep(0, 1, (v - at + offsets[k] * amp) / ramp + 0.5);
        fill *= pinTop;
        fill = 1 - (1 - fill) * pinBottom;
        if (fill < SEAM.minFill) continue;
        const x = x0 + i * cell;
        const y = y0 + j * cell;
        if (dither) {
          if (fill > BAYER[(j % 4) * 4 + (i % 4)]) ctx.rect(x, y, cell, cell);
        } else if (fill > 0.985) {
          ctx.rect(x, y, cell, cell);
        } else if (dots) {
          // Circles overlap their neighbours past half, so the gaps close the way a print halftone's do.
          const r = cell * 0.7072 * Math.sqrt(fill);
          ctx.moveTo(x + cell / 2 + r, y + cell / 2);
          ctx.arc(x + cell / 2, y + cell / 2, r, 0, Math.PI * 2);
        } else {
          // Even pixel sizes keep a square centred on the pixel grid, and a square within
          // `grout` of its cell fills it, so the field never shows hairline outlines.
          const side = Math.floor((cell * Math.sqrt(fill)) / 2) * 2;
          if (cell - side < SEAM.grout) ctx.rect(x, y, cell, cell);
          else if (side >= 2)
            ctx.rect(x + (cell - side) / 2, y + (cell - side) / 2, side, side);
        }
      }
    }
    ctx.fill();
  }

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60);
    last = now;
    if (options.reduced) {
      front = target;
      velocity = 0;
    } else {
      const { stiffness, damping } = options;
      const { mass } = TIMING.front;
      const accel = (stiffness * (target - front) - damping * velocity) / mass;
      velocity += accel * dt;
      front += velocity * dt;
    }
    draw();
    if (Math.abs(target - front) < 1e-4 && Math.abs(velocity) < 1e-3) {
      front = target;
      velocity = 0;
      draw();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    target = measure();
    if (!visible) return;
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  /** Jump straight to the scroll position: on mount, resize and coming back on screen. */
  function snap() {
    target = front = measure();
    velocity = 0;
    draw();
  }

  return {
    connect(el: {
      root: HTMLElement;
      canvas: HTMLCanvasElement;
      from: HTMLElement | null;
      to: HTMLElement | null;
    }) {
      root = el.root;
      canvas = el.canvas;
      ctx = canvas.getContext("2d");
      probes = { from: el.from, to: el.to };
      readColors();
      layout();
      snap();

      const resize = new ResizeObserver(() => {
        layout();
        snap();
      });
      resize.observe(root);
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) snap();
      });
      io.observe(root);

      // Scroll events don't bubble, but they do pass through the capture phase, so one listener
      // hears the window and whatever box the band scrolls inside.
      const onScroll = () => wake();
      window.addEventListener("scroll", onScroll, {
        capture: true,
        passive: true,
      });
      window.addEventListener("resize", onScroll, { passive: true });

      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const recolor = () => {
        // Let the new scheme's styles land before reading the neighbours' backgrounds.
        requestAnimationFrame(() => {
          readColors();
          draw();
        });
      };
      scheme.addEventListener("change", recolor);
      const themeAttrs = new MutationObserver(recolor);
      themeAttrs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"],
      });

      cleanups.push(
        () => resize.disconnect(),
        () => io.disconnect(),
        () => window.removeEventListener("scroll", onScroll, { capture: true }),
        () => window.removeEventListener("resize", onScroll),
        () => scheme.removeEventListener("change", recolor),
        () => themeAttrs.disconnect(),
      );
      return () => {
        cancelAnimationFrame(raf);
        raf = 0;
        cleanups.splice(0).forEach((fn) => fn());
        root = canvas = scroller = null;
        ctx = null;
      };
    },

    setOptions(next: Options) {
      const relayout = next.cell !== options.cell || next.seed !== options.seed;
      const driven = next.progress !== options.progress;
      options = next;
      if (relayout) layout();
      readColors();
      if (driven && next.progress !== undefined) wake();
      else snap();
    },
  };
}

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function useReduced() {
  return React.useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

export interface SeamProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What the band breaks up into: halftone `dots`, halftone `squares`, or a pixel `dither`. */
  pattern?: SeamPattern;
  /** Size of one cell, in px. */
  cell?: number;
  /** How ragged the front is, from a straight line (`0`) to deep tongues (`1`). */
  grain?: number;
  /** Hold or drive the front yourself, from `0` (all the section above) to `1` (all the section below). Leave it out to follow scroll. */
  progress?: number;
  /** Changes the shape of the front's tongues. */
  seed?: number;
  /** Stiffness of the spring the front rides as it follows scroll. Higher keeps it closer to the scroll. */
  stiffness?: number;
  /** Damping of that spring. Lower lets the front overshoot and settle back. */
  damping?: number;
  /** A `text-*` color for the section above. Without it, the band reads the background of the element before it. */
  fromClassName?: string;
  /** A `text-*` color for the section below. Without it, the band reads the background of the element after it. */
  toClassName?: string;
}

export function Seam({
  pattern = "dots",
  cell = 12,
  grain = 0.6,
  progress,
  seed = 1,
  stiffness = TIMING.front.stiffness,
  damping = TIMING.front.damping,
  fromClassName,
  toClassName,
  className,
  children,
  ...props
}: SeamProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fromRef = React.useRef<HTMLSpanElement>(null);
  const toRef = React.useRef<HTMLSpanElement>(null);
  const [seam] = React.useState(createSeam);
  const reduced = useReduced();

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    return seam.connect({
      root,
      canvas,
      from: fromRef.current,
      to: toRef.current,
    });
  }, [seam, fromClassName, toClassName]);

  React.useEffect(() => {
    seam.setOptions({
      pattern,
      cell,
      grain,
      progress,
      seed,
      stiffness: Math.max(1, stiffness),
      damping: Math.max(0, damping),
      reduced,
    });
  }, [seam, pattern, cell, grain, progress, seed, stiffness, damping, reduced]);

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate h-40 w-full overflow-hidden", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 size-full"
      />
      {fromClassName ? (
        <span
          ref={fromRef}
          aria-hidden
          className={cn("hidden", fromClassName)}
        />
      ) : null}
      {toClassName ? (
        <span ref={toRef} aria-hidden className={cn("hidden", toClassName)} />
      ) : null}
      {children}
    </div>
  );
}
