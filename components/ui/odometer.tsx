"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  PresenceContext,
  useInView,
  useMotionValue,
  usePresence,
  usePresenceData,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Keep:
 * - Each wheel's position is one continuous motion value drawn through `mod10`, so rolls, wraps and
 *   retargets are transforms and never re-render React per frame.
 * - Digits roll the way the value moved, the long way round if they must, and unchanged digits stay
 *   still; the ripple starts at the rightmost changed place and each place left waits one `stagger`.
 * - `rollSpring` damps long rolls so a wheel never runs more than `ODOMETER.overshoot` past its digit,
 *   and widths open and close on a critically damped spring, so the layout never wobbles.
 * - Parts are keyed by place (`d0`, `g3`), so a new leading digit doesn't re-key the rest; the
 *   `sr-only` text carries the value while every slot is `aria-hidden`.
 * - Reduced motion crossfades digits in place instead of rolling them, and widths jump.
 */
const TIMING = {
  /** The roll's spring stiffness (the `stiffness` prop). The width spring shares it. */
  stiffness: 150,
  /** The roll's spring damping (the `damping` prop). Long rolls get a little extra. */
  damping: 18,
  /** Between neighboring places starting to roll, right to left, in seconds (the `stagger` prop). */
  stagger: 0.03,
  /** Before rolling, after a change or on scrolling into view, in seconds (the `delay` prop). */
  delay: 0,
  /** When a wheel's spring counts as settled: within 0.001 of a digit, under 0.01 digits per second. */
  rollRest: { restDelta: 0.001, restSpeed: 0.01 },
  /** When a slot's width spring counts as settled: within 0.1px, under 1px per second. */
  widthRest: { restDelta: 0.1, restSpeed: 1 },
  /** A symbol's crossfade as it changes, in seconds. Its slide rides the roll's spring. */
  symbolFade: { duration: 0.25, ease: "easeOut" },
  /** Reduced motion crossfades digits instead of rolling them, in seconds. */
  fade: { duration: 0.15, ease: "linear" },
} as const;

/* ─────────────────────────────────────────────────────────
 * ODOMETER STORYBOARD
 *
 *  rest      plain text: every digit sits crisp in its own
 *            window, on the baseline of the words around it
 *  change    each digit that differs rolls on its wheel of
 *            0–9: up when the value grows, down when it
 *            shrinks, the long way round if it has to (19 → 21
 *            rolls the ones through 0). Digits that didn't
 *            change don't move at all
 *  ripple    the rightmost changing digit goes first and each
 *            place to its left follows 30ms later, like a carry
 *  land      a spring brings each wheel home in about 0.6s,
 *            a hair past its digit and back. Long rolls are
 *            damped a little more, so nothing ever bounces
 *  grow      a new leading digit, and its comma, roll in from
 *            below as their width eases open; a digit that's
 *            no longer needed rolls out and its width closes
 *  swap      symbols ($ , . % K −) don't roll. They ride along
 *            with the layout and crossfade when they change
 *  redirect  a new value mid-roll turns every wheel from where
 *            it is, at the speed it's going
 *  reveal    with rollOnView, the wheels wait on 0 until the
 *            number scrolls into view, then roll up to it
 *
 *  Each wheel's position is one continuous number (the ones
 *  wheel goes 9 → 11 for 19 → 21) and its digits are drawn
 *  by modulo, so wraps and retargets need no special cases.
 *  Rolls are transforms on motion values: no React render
 *  per frame.
 * ───────────────────────────────────────────────────────── */

const ODOMETER = {
  pitch: 1.05, // em between neighboring digits on a wheel; a digit arrives or leaves by one
  travel: 1.35, // em a symbol rolls to arrive or leave
  overshoot: 0.045, // furthest a wheel may run past its digit, in digits
  drift: 0.35, // em a changing symbol slides as it crossfades
  reveal: 0.6, // share of the number in view before rollOnView rolls
};

// The window a glyph shows through: 0.35em taller than the line above and
// below, with negative margins so the line's height and width don't change.
const WINDOW =
  "pointer-events-none relative block shrink-0 -mx-[0.25em] -my-[0.35em] px-[0.25em] py-[0.35em]";
// Digits are opaque within 0.4em of the line's middle, just room for the
// glyph and its overshoot, and gone by 0.62em: a digit fades the moment it
// leaves its place, like passing the edge of a window. A resting neighbor, a
// pitch away, sits wholly in the clear.
const DIGIT_MASK =
  "[mask-image:linear-gradient(to_bottom,transparent_calc(50%-0.62em),#000_calc(50%-0.4em),#000_calc(50%+0.4em),transparent_calc(50%+0.62em))]";
// Symbols keep a little more room, for $ and the tails of commas.
const SYMBOL_MASK =
  "[mask-image:linear-gradient(to_bottom,transparent_calc(50%-0.72em),#000_calc(50%-0.5em),#000_calc(50%+0.58em),transparent_calc(50%+0.8em))]";
// One glyph, laid out exactly like the sizer inside the window.
const CELL = "absolute inset-x-0 top-0 h-full px-[0.25em] py-[0.35em]";
const ALIGN = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};
const TEXT = { start: "text-left", center: "text-center", end: "text-right" };
// A wheel: 9, 0, 1 … 9, 0, so the window always has a neighbor on both sides.
const CELLS = Array.from({ length: 12 }, (_, i) => i);

type Align = keyof typeof ALIGN;

type Part = {
  /** Stable across values: digits and commas are keyed by place, so a new leading digit doesn't re-key the rest. */
  key: string;
  text: string;
  /** 0–9 for a digit, null for a symbol. */
  digit: number | null;
  /** Place value of a digit or of the digit left of a comma: 0 is ones, -1 tenths. */
  place: number | null;
  /** The side the slot hangs from while it's narrower than its glyph. */
  align: Align;
};

type Change = {
  sig: string;
  value: number;
  parts: Part[];
  pending: boolean;
  /** 1 when the value grew, -1 when it shrank. */
  dir: number;
  /** Place of the rightmost digit that changed: the ripple starts there. */
  origin: number;
  /** Jump instead of rolling. */
  instant: boolean;
  /** The first roll up from 0 with rollOnView. */
  reveal: boolean;
};

type Config = {
  stiffness: number;
  damping: number;
  stagger: number;
  delay: number;
  reduced: boolean;
};

type Grouping = "international" | "indian";

type Formatter = {
  nf: Intl.NumberFormat;
  digits: string[];
  /** The locale's thousands separator. */
  separator: string;
  /** Fewest integer digits that get a separator: 4, 5 for "min2", never when grouping is off. */
  least: number;
};

const formatters = new Map<string, Formatter>();

function getFormatter(
  locale: string,
  format: Intl.NumberFormatOptions | undefined,
): Formatter {
  const id = `${locale} ${JSON.stringify(format ?? {})}`;
  let f = formatters.get(id);
  if (!f) {
    const nf = new Intl.NumberFormat(locale, format);
    // The locale's own digits, so wheels in other numbering systems still roll.
    const plain = new Intl.NumberFormat(locale, {
      numberingSystem: nf.resolvedOptions().numberingSystem,
      useGrouping: false,
    });
    const useGrouping = nf.resolvedOptions().useGrouping as unknown;
    f = {
      nf,
      digits: CELLS.slice(0, 10).map((d) => plain.format(d)),
      separator:
        [nf, new Intl.NumberFormat(locale)]
          .map(
            (n) => n.formatToParts(1e6).find((p) => p.type === "group")?.value,
          )
          .find(Boolean) ?? ",",
      least: useGrouping === false ? Infinity : useGrouping === "min2" ? 5 : 4,
    };
    if (formatters.size > 200) formatters.clear();
    formatters.set(id, f);
  }
  return f;
}

/**
 * Moves the separators to a grouping of its own: threes all the way
 * (1,234,567), or the Indian lakh and crore, three then twos (12,34,567).
 * Everything else the locale chose, symbols and separator alike, stays.
 */
function regroup(
  raw: Intl.NumberFormatPart[],
  grouping: Grouping | undefined,
  { separator, least }: Pick<Formatter, "separator" | "least">,
) {
  if (!grouping || least === Infinity) return raw;
  const integer = Array.from(
    raw
      .filter((p) => p.type === "integer")
      .map((p) => p.value)
      .join(""),
  );
  const out: Intl.NumberFormatPart[] = [];
  let placed = false;
  for (const p of raw) {
    if (p.type === "group") continue;
    if (p.type !== "integer") {
      out.push(p);
      continue;
    }
    if (placed) continue;
    placed = true;
    const groups: string[] = [];
    let end = integer.length;
    let size = integer.length < least ? end : 3;
    while (end > 0) {
      groups.unshift(integer.slice(Math.max(0, end - size), end).join(""));
      end -= size;
      if (grouping === "indian") size = 2;
    }
    groups.forEach((value, i) => {
      if (i > 0) out.push({ type: "group", value: separator });
      out.push({ type: "integer", value });
    });
  }
  return out;
}

function toParts(raw: Intl.NumberFormatPart[], digits: string[]): Part[] {
  let place = 0;
  for (const p of raw)
    if (p.type === "integer") place += Array.from(p.value).length;

  const parts: Part[] = [];
  const seen: Record<string, number> = {};
  let fraction = 0;
  let inside = false; // past the first digit
  for (const p of raw) {
    if (p.type === "integer" || p.type === "fraction") {
      inside = true;
      for (const char of Array.from(p.value)) {
        const at = p.type === "integer" ? --place : -++fraction;
        const digit = digits.indexOf(char);
        parts.push({
          key: `d${at}`,
          text: char,
          digit: digit < 0 ? null : digit,
          place: at,
          align: at < 0 ? "start" : "end",
        });
      }
    } else if (p.type === "group") {
      parts.push({
        key: `g${place}`,
        text: p.value,
        digit: null,
        place,
        align: "end",
      });
    } else if (p.type === "decimal") {
      inside = true;
      parts.push({
        key: "decimal",
        text: p.value,
        digit: null,
        place: null,
        align: "center",
      });
    } else {
      // + and − share a slot, so a sign flip crossfades; so do K, M and B.
      const type =
        p.type === "plusSign" || p.type === "minusSign" ? "sign" : p.type;
      const id = `${inside ? "post" : "pre"}-${type}`;
      seen[id] = (seen[id] ?? -1) + 1;
      parts.push({
        key: `${id}-${seen[id]}`,
        // A true minus, the same width as the plus it swaps with.
        text: p.type === "minusSign" ? p.value.replace("-", "−") : p.value,
        digit: null,
        place: null,
        align: inside ? "start" : "end",
      });
    }
  }
  return parts;
}

/** The rightmost place whose digit differs, counting added and removed digits. */
function originOf(before: Part[], after: Part[]) {
  const was = new Map(before.map((p) => [p.key, p]));
  const is = new Map(after.map((p) => [p.key, p]));
  let origin = Infinity;
  for (const p of after) {
    if (p.place !== null && was.get(p.key)?.text !== p.text)
      origin = Math.min(origin, p.place);
  }
  for (const p of before) {
    if (p.place !== null && !is.has(p.key)) origin = Math.min(origin, p.place);
  }
  return Number.isFinite(origin) ? origin : 0;
}

const mod10 = (n: number) => ((n % 10) + 10) % 10;

/**
 * The roll's spring. Overshoot grows with the distance rolled, so long rolls
 * (and fast retargets) get just enough extra damping to stay under
 * ODOMETER.overshoot: a hint past the digit, never a bounce.
 */
function rollSpring(cfg: Config, distance: number, velocity: number) {
  const omega = Math.sqrt(cfg.stiffness);
  const zeta = cfg.damping / (2 * omega);
  const reach =
    Math.abs(distance) + Math.max(0, Math.sign(distance) * velocity) / omega;
  let damping = cfg.damping;
  if (zeta < 1 && reach > ODOMETER.overshoot) {
    const r = Math.min(
      Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)),
      ODOMETER.overshoot / reach,
    );
    const ln = Math.log(r);
    damping = Math.max(
      damping,
      (-2 * omega * ln) / Math.sqrt(Math.PI * Math.PI + ln * ln),
    );
  }
  return {
    type: "spring" as const,
    stiffness: cfg.stiffness,
    damping,
    ...TIMING.rollRest,
  };
}

/** Width opens and closes on the same spring, critically damped: layout never wobbles. */
function widthSpring(cfg: Config) {
  return {
    type: "spring" as const,
    stiffness: cfg.stiffness,
    damping: 2 * Math.sqrt(cfg.stiffness),
    ...TIMING.widthRest,
  };
}

const subscribe = () => () => {};
const offscreen: React.RefObject<Element | null> = { current: null };

export interface OdometerProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  /** The number to show. Changes roll. */
  value: number;
  /** Intl.NumberFormat options: currency, decimals, percent, compact, units. */
  format?: Intl.NumberFormatOptions;
  /** Locale for formatting. Fixed by default so the server and browser agree. */
  locale?: string;
  /** Spring stiffness of the roll. Higher is snappier. */
  stiffness?: number;
  /** Spring damping of the roll. Lower overshoots more; long rolls get a little extra. */
  damping?: number;
  /** Seconds between neighboring places starting to roll, from right to left. */
  stagger?: number;
  /** Seconds to wait before rolling, after a change or on scrolling into view. */
  delay?: number;
  /** Hold every wheel on 0 until the number first scrolls into view, then roll up to it. */
  rollOnView?: boolean;
  /** Where the separators go: by thousands, or by lakh and crore. Follows the locale when unset. */
  grouping?: Grouping;
}

/**
 * A number that rolls each digit on its own wheel. Inline: it inherits the
 * font, size and color, and sits on the baseline of the text around it.
 */
export function Odometer({
  value,
  format,
  locale = "en-US",
  stiffness = TIMING.stiffness,
  damping = TIMING.damping,
  stagger = TIMING.stagger,
  delay = TIMING.delay,
  rollOnView = false,
  grouping,
  className,
  ...props
}: OdometerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  // False while rendering on the server and hydrating that HTML, so both draw
  // the final value; true from the first render after.
  const hydrated = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reduced = (useReducedMotion() ?? false) && hydrated;
  const seen = useInView(rollOnView ? ref : offscreen, {
    once: true,
    amount: ODOMETER.reveal,
  });
  const pending = rollOnView && hydrated && !seen && !reduced;

  const { nf, digits, separator, least } = getFormatter(locale, format);
  const raw = regroup(nf.formatToParts(value), grouping, { separator, least });
  const final = toParts(raw, digits);
  const parts = pending
    ? final.map((p) =>
        p.digit === null ? p : { ...p, digit: 0, text: digits[0] },
      )
    : final;
  const shown = pending ? 0 : value;
  const sig = parts.map((p) => p.key + p.text).join(" ");

  const [change, setChange] = React.useState<Change>(() => ({
    sig,
    value: shown,
    parts,
    pending,
    dir: 1,
    origin: 0,
    instant: true,
    reveal: false,
  }));
  if (change.sig !== sig || change.pending !== pending) {
    const reveal = change.pending && !pending;
    setChange({
      sig,
      value: shown,
      parts,
      pending,
      dir: reveal || shown >= change.value ? 1 : -1,
      origin: originOf(change.parts, parts),
      // Anything that happens before the reveal happens off screen.
      instant: pending,
      reveal,
    });
  }

  const cfg = React.useMemo<Config>(
    () => ({ stiffness, damping, stagger, delay, reduced }),
    [stiffness, damping, stagger, delay, reduced],
  );

  return (
    <span
      ref={ref}
      className={cn(
        "relative inline-flex items-baseline whitespace-pre lining-nums tabular-nums",
        className,
      )}
      {...props}
    >
      <span className="sr-only">{raw.map((p) => p.value).join("")}</span>
      <AnimatePresence initial={false} custom={change}>
        {change.parts.map((part) => (
          <Slot
            key={part.key}
            part={part}
            change={change}
            cfg={cfg}
            digits={digits}
            full={rollOnView && hydrated}
          />
        ))}
      </AnimatePresence>
    </span>
  );
}

/**
 * One digit or symbol. Owns its presence: a slot that arrives rolls in as its
 * width opens, and one that leaves rolls out as its width closes.
 */
function Slot({
  part,
  change,
  cfg,
  digits,
  full,
}: {
  part: Part;
  change: Change;
  cfg: Config;
  /** The locale's 0–9. */
  digits: string[];
  full: boolean;
}) {
  const context = React.useContext(PresenceContext);
  const [isPresent, safeToRemove] = usePresence();
  // A leaving slot keeps its last props; the change that removed it comes from here.
  const removedBy = usePresenceData() as Change | undefined;
  const now = isPresent ? change : (removedBy ?? change);
  const wait =
    cfg.delay +
    (part.place === null
      ? 0
      : Math.max(0, part.place - now.origin) * cfg.stagger);

  // Slots in the first render are just there; later ones arrive.
  const [arrives] = React.useState(
    () =>
      context !== null &&
      context.initial !== false &&
      !change.instant &&
      !cfg.reduced,
  );
  const width = useMotionValue<number | "auto">(arrives ? 0 : "auto");
  const shift = useMotionValue(arrives ? change.dir : 0); // in travels; +1 is one below

  const slotRef = React.useRef<HTMLSpanElement>(null);
  const sizerRef = React.useRef<HTMLSpanElement>(null);
  const latest = React.useRef({
    wait,
    dir: now.dir,
    instant: now.instant,
    cfg,
    safeToRemove,
  });
  React.useLayoutEffect(() => {
    latest.current = {
      wait,
      dir: now.dir,
      instant: now.instant,
      cfg,
      safeToRemove,
    };
  });

  // Arrive, leave, or come back while leaving.
  React.useLayoutEffect(() => {
    const slot = slotRef.current;
    const sizer = sizerRef.current;
    if (!slot || !sizer) return;
    const { wait, dir, instant, cfg, safeToRemove } = latest.current;
    const moving = Math.abs(shift.getVelocity()) > 0.01;
    const delay = moving ? 0 : wait;

    if (isPresent) {
      if (width.get() === "auto" && shift.get() === 0) return;
      if (cfg.reduced || instant) {
        width.set("auto");
        shift.jump(0);
        return;
      }
      if (width.get() === "auto")
        width.jump(slot.getBoundingClientRect().width);
      animate(width, sizer.getBoundingClientRect().width, {
        ...widthSpring(cfg),
        delay,
        onComplete: () => width.set("auto"),
      });
      animate(shift, 0, {
        ...rollSpring(cfg, -shift.get(), shift.getVelocity()),
        delay,
      });
      return;
    }

    if (cfg.reduced || instant) {
      safeToRemove?.();
      return;
    }
    if (width.get() === "auto") width.jump(slot.getBoundingClientRect().width);
    let left = 2;
    const done = () => {
      if (--left === 0) safeToRemove?.();
    };
    animate(width, 0, { ...widthSpring(cfg), delay, onComplete: done });
    animate(shift, -dir, {
      ...rollSpring(cfg, -dir - shift.get(), shift.getVelocity()),
      delay,
      onComplete: done,
    });
  }, [isPresent, width, shift]);

  // A symbol that changes ("K" → "M") eases to its new width as it crossfades.
  // Digits all share one width, so they skip this.
  const natural = React.useRef<number | null>(null);
  React.useLayoutEffect(() => {
    const sizer = sizerRef.current;
    if (part.digit !== null || !sizer) return;
    const to = sizer.getBoundingClientRect().width;
    const from = natural.current;
    natural.current = to;
    const { cfg, instant } = latest.current;
    if (from === null || cfg.reduced || instant) return;
    if (width.get() === "auto") {
      if (Math.abs(from - to) < 0.5) return;
      width.jump(from);
    }
    animate(width, to, {
      ...widthSpring(cfg),
      onComplete: () => width.set("auto"),
    });
  }, [part.text, part.digit, width]);

  return (
    // The wheels inside answer to this slot's presence, not to the number's.
    <PresenceContext.Provider value={null}>
      <motion.span
        ref={slotRef}
        aria-hidden
        className={cn(
          "flex min-w-0 items-baseline select-none",
          ALIGN[part.align],
        )}
        style={{ width }}
      >
        <span
          className={cn(
            WINDOW,
            part.digit !== null && !cfg.reduced ? DIGIT_MASK : SYMBOL_MASK,
          )}
        >
          <span ref={sizerRef} className="invisible">
            {part.text}
          </span>
          {part.digit !== null && !cfg.reduced ? (
            <Wheel
              digit={part.digit}
              change={now}
              wait={wait}
              cfg={cfg}
              shift={shift}
              solo={!isPresent}
              digits={digits}
              full={full}
            />
          ) : (
            <Glyphs
              text={part.text}
              align={part.align}
              dir={now.dir}
              cfg={cfg}
              shift={shift}
            />
          )}
        </span>
      </motion.span>
    </PresenceContext.Provider>
  );
}

/** A strip of digits that rolls through the window. */
function Wheel({
  digit,
  change,
  wait,
  cfg,
  shift,
  solo,
  digits,
  full,
}: {
  digit: number;
  change: Change;
  wait: number;
  cfg: Config;
  shift: MotionValue<number>;
  /** Show only the digit itself, for rolling in and out without neighbors. */
  solo: boolean;
  digits: string[];
  /** Draw the whole wheel even before it turns, so a 0 can spin all the way round. */
  full: boolean;
}) {
  // A wheel that has never turned draws only its digit, so the server's HTML
  // is just the number.
  const [first] = React.useState(digit);
  const [turned, setTurned] = React.useState(false);
  if (!turned && digit !== first) setTurned(true);

  const pos = useMotionValue(digit);
  const y = useTransform(
    [pos, shift],
    ([p, s]: number[]) => `${(s - mod10(p) - 1) * ODOMETER.pitch}em`,
  );
  const goal = React.useRef(digit); // where the wheel is heading, unwrapped
  const due = React.useRef(0); // when a staggered roll that hasn't started yet begins, ms
  const spun = React.useRef<Change | null>(null);

  const latest = React.useRef({ change, wait, cfg });
  React.useLayoutEffect(() => {
    latest.current = { change, wait, cfg };
  });

  React.useLayoutEffect(() => {
    const { change, wait, cfg } = latest.current;
    const from = mod10(goal.current);
    let steps = change.dir > 0 ? mod10(digit - from) : -mod10(from - digit);
    // On the reveal a 0 turns once around, so every wheel comes alive.
    if (change.reveal && steps === 0 && spun.current !== change) steps = 10;
    spun.current = change;
    if (steps === 0) return;
    goal.current += steps;
    if (change.instant) {
      pos.jump(goal.current);
      return;
    }
    // A wheel already turning redirects at once. One still waiting for its
    // turn in the ripple keeps its place in line, so fast changes can't hold
    // it back forever.
    const t = performance.now();
    const moving = Math.abs(pos.getVelocity()) > 0.01;
    const delay = t < due.current ? due.current - t : moving ? 0 : wait * 1000;
    due.current = t + delay;
    animate(pos, goal.current, {
      ...rollSpring(cfg, goal.current - pos.get(), pos.getVelocity()),
      delay: delay / 1000,
    });
  }, [digit, change, pos]);

  const cells = solo || !(turned || full) ? [digit + 1] : CELLS;
  return (
    <motion.span className="absolute inset-0" style={{ y }}>
      {cells.map((i) => (
        <span
          key={i}
          className={cn(CELL, "text-center")}
          style={{ top: `${i * ODOMETER.pitch}em` }}
        >
          {digits[(i + 9) % 10]}
        </span>
      ))}
    </motion.span>
  );
}

const swap = {
  enter: (dir: number) => ({ opacity: 0, y: `${dir * ODOMETER.drift}em` }),
  center: { opacity: 1, y: "0em" },
  exit: (dir: number) => ({ opacity: 0, y: `${-dir * ODOMETER.drift}em` }),
};
const fade = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/** A symbol, or a digit under reduced motion: crossfades when it changes. */
function Glyphs({
  text,
  align,
  dir,
  cfg,
  shift,
}: {
  text: string;
  align: Align;
  dir: number;
  cfg: Config;
  shift: MotionValue<number>;
}) {
  const y = useTransform(shift, (s) => `${s * ODOMETER.travel}em`);
  return (
    <motion.span className="absolute inset-0" style={{ y }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.span
          key={text}
          custom={dir}
          variants={cfg.reduced ? fade : swap}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            cfg.reduced
              ? TIMING.fade
              : { y: rollSpring(cfg, 1, 0), opacity: TIMING.symbolFade }
          }
          className={cn(CELL, TEXT[align])}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
