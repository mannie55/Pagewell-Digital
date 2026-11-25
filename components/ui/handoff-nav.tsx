"use client";

import * as React from "react";
import { LazyMotion, type AnimationPlaybackControls } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/cn";
import {
  getMotionEngine,
  loadMotionEngine,
  loadMotionFeaturesWhenNeeded,
} from "@/lib/motion-loader";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Keep:
 * - The caught button is a second copy in the pill's slot, flown by `transform`, width and height
 *   on one spring's progress; the hero keeps an empty space its size, so nothing under it moves.
 * - A flight runs in two legs so the button never crosses the links: up, it slides along under the
 *   pill and rises into the slot last; home, it drops out of the pill first and then slides.
 * - The label only travels, it never scales: it sits in one span that keeps its own width, which is
 *   also what the pill measures to open the slot.
 * - The hand between copies is invisible: the copy is placed over its start before the original
 *   hides, coming home both show for a frame or two (never neither), and focus moves with it.
 * - Reduced motion: nothing travels. The bar swaps to the pill at once, the button crossfades
 *   between hero and pill, and the menu opens without growing.
 */
const TIMING = {
  /** The bar tightening into the pill: a spring, in seconds (`visualDuration`: `dockDuration`). */
  dock: { type: "spring", visualDuration: 0.4, bounce: 0 },
  /** Spreading out again at the top, quicker: a spring, in seconds, scaled by `dockDuration`. */
  undock: { type: "spring", visualDuration: 0.3, bounce: 0 },
  /** The slot opening, ahead of the button: a spring, in seconds. */
  make: { type: "spring", visualDuration: 0.3, bounce: 0 },
  /** The slot closing, behind it: a spring, in seconds. */
  shut: { type: "spring", visualDuration: 0.34, bounce: 0, delay: 0.06 },
  /**
   * The button flying up into the pill: a spring, in seconds (`visualDuration` is the
   * `catchDuration` prop, `bounce` the `catchBounce` prop).
   */
  catch: { type: "spring", visualDuration: 0.45, bounce: 0.08 },
  /** And back down into the hero: a spring, in seconds, scaled by `catchDuration`. */
  release: { type: "spring", visualDuration: 0.38, bounce: 0 },
  /** The menu panel growing: a spring, in seconds. */
  open: { type: "spring", visualDuration: 0.4, bounce: 0.06 },
  /** The menu panel closing: a spring, in seconds. */
  close: { type: "spring", visualDuration: 0.3, bounce: 0 },
  /** The link highlight sliding: a spring, in seconds. */
  hover: { type: "spring", visualDuration: 0.3, bounce: 0 },
  /** The pill's surface fading in or out, in seconds. */
  fill: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  /** Fades: the link highlight, reduced motion's swaps, a far-off button arriving, in seconds. */
  fade: { duration: 0.15, ease: "easeOut" },
  /** A far-off button waiting for its slot to open before it fades in, in seconds. */
  slotWait: 0.2,
  /** Between menu links as they arrive, in seconds. */
  stagger: 0.03,
  /** Between menu links as they leave, last first, in seconds. */
  tuck: 0.02,
  /** The links' and buttons' hover color, as a Tailwind class. */
  color: "duration-150",
  /** The hero button's hover fill and press, as Tailwind classes. */
  press: "duration-150 ease-out",
} as const;

/* ─────────────────────────────────────────────────────────
 * HANDOFF NAV STORYBOARD
 *
 *  rest     a full-width bar on the page itself: logo at the start,
 *           links and a quiet outlined action at the end, 64px tall,
 *           no fill and no border
 *  dock     past 24px of scroll the bar tightens into a pill that
 *           floats 12px below the top. It narrows to fit what's in it
 *           and drops to 48px while the frosted fill, the hairline and
 *           a soft shadow fade in: one 0.4s spring, no bounce. Back at
 *           the top it spreads out again, quicker (0.3s)
 *  catch    the hero's button rides up the page, and the moment its
 *           top edge meets the pill's underside it lifts off. The pill
 *           widens to open a slot at its end (0.3s, the links slide aside)
 *           and the button flies into it, going from 44px to 32px tall
 *           on a 0.45s spring with the smallest settle. Its label only
 *           travels, it never scales. It slides along under the pill
 *           and rises into the slot last, so it never crosses the
 *           links. The hero keeps an empty space the button's size, so
 *           nothing under it moves
 *  release  scroll back until that space is 8px clear of the pill and
 *           the button drops out of the pill and flies home (0.38s, no
 *           bounce), following the space as the page moves; the slot
 *           closes behind it
 *  again    reversing mid-flight turns the button round from wherever
 *           it is. A button that's far off screen (a jump to the
 *           bottom) fades into the slot instead of crossing the page
 *  hover    a soft highlight slides from link to link under a mouse
 *  menu     on narrow screens the links fold into a menu button. The
 *           pill keeps its width, so the button stays under the finger,
 *           and grows down into a panel (0.4s, a slight settle); its
 *           links rise 8px into place 30ms apart and tuck back in,
 *           last first, when it closes (0.3s)
 *  keys     Tab runs logo → links → action → caught button → menu. Esc
 *           closes the menu and puts focus back on its button. A
 *           focused hero button hands its focus to the caught copy
 *  reduced  nothing travels: the bar swaps to the pill at once, the
 *           button fades out of the hero while its copy fades into the
 *           pill, and the menu opens without growing
 * ───────────────────────────────────────────────────────── */

const NAV = {
  rest: 64, // px; the bar's height at the top of the page
  docked: 48, // px; the pill's height
  top: 12, // px; the pill's distance from the top once docked
  padStart: 16, // px inside the pill before the logo
  padEnd: 8, // px inside the pill after the last item
  gap: 32, // px; the least room between the logo and the links in the pill
  slotGap: 8, // px between the links and the caught button
  clear: 8, // px the hero's space must clear below the pill before the button flies home
  rise: 8, // px a menu link rises into place from
} as const;

/**
 * Menu icon motion, from the Figma file ("02 · Staged fold · Open / Close").
 *  shrink   on scroll the two lines shorten from 36px to 18px (350ms, ease in-out),
 *           making room for the caught button; they lengthen again at the top
 *  open     the lines meet in the middle (220ms, ease out), then turn into an X
 *           (300ms, ease out)
 *  close    the X turns flat (300ms, ease in-out), then the lines part (250ms, ease out)
 */
const MENU_ICON = {
  long: 36, // px; line length at the top of the page
  short: 18, // px; line length once docked or open
  gap: 4.5, // px each line sits from the middle (9px apart)
  shrinkClass: "duration-[350ms]",
  open: {
    width: { duration: 0.35, ease: "easeInOut" },
    y: { duration: 0.22, ease: "easeOut" },
    rotate: { duration: 0.3, ease: "easeOut", delay: 0.22 },
  },
  close: {
    width: { duration: 0.35, ease: "easeInOut" },
    rotate: { duration: 0.3, ease: "easeInOut" },
    y: { duration: 0.25, ease: "easeOut", delay: 0.3 },
  },
} as const;

type Why = "dock" | "undock" | "catch" | "release" | "open" | "close";
type Mode = { docked: boolean; caught: boolean; open: boolean; why: Why };
type Rect = { x: number; y: number; w: number; h: number };
type Sizes = {
  rest: number;
  logo: number;
  group: number;
  menu: number;
  cta: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// A flight in two legs, so the button never crosses the links. Going up it slides along under the
// pill first and rises into its slot last; going home it drops out of the pill first and then
// slides to its place. Each leg eases out over its share of the spring's progress, and past 1
// (the spring's settle) both run straight, so the overshoot stays small.
const leg = (t: number, start: number, end: number) => {
  if (t >= 1) return t;
  const u = Math.min(1, Math.max(0, (t - start) / (end - start)));
  return 1 - (1 - u) * (1 - u);
};
const flightRect = (a: Rect, b: Rect, t: number, to: "nav" | "home"): Rect => ({
  x: lerp(a.x, b.x, to === "nav" ? leg(t, 0, 0.7) : leg(t, 0.3, 1)),
  y: lerp(a.y, b.y, to === "nav" ? leg(t, 0.55, 1) : leg(t, 0, 0.45)),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});
const toRect = (r: DOMRect): Rect => ({
  x: r.left,
  y: r.top,
  w: r.width,
  h: r.height,
});

/* ── Handoff store ──────────────────────────────────────── */

// What the hero's button tells the nav: how to draw its copy, and where it lives. One store per
// provider, so two navs on one page (or one docs page) never catch each other's buttons.
type Cta = {
  label: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
};
type HandoffState = { cta: Cta | null; away: boolean };

const EMPTY: HandoffState = { cta: null, away: false };

function createHandoff() {
  let state = EMPTY;
  let home: HTMLElement | null = null;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(patch: Partial<HandoffState>) {
      state = { ...state, ...patch };
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    home: () => home,
    setHome(element: HTMLElement | null) {
      home = element;
    },
  };
}

type Handoff = ReturnType<typeof createHandoff>;

const HandoffContext = React.createContext<Handoff | null>(null);
const noSubscribe = () => () => {};

function useHandoffState(store: Handoff | null) {
  return React.useSyncExternalStore(
    store?.subscribe ?? noSubscribe,
    () => store?.get() ?? EMPTY,
    () => EMPTY,
  );
}

/* ── Types ──────────────────────────────────────────────── */

export interface HandoffNavLink {
  label: string;
  href: string;
}

export interface HandoffNavProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  /** Your logo or wordmark, at the start of the bar. Wrap it in a link to your home page. */
  logo: React.ReactNode;
  /** The page links. They sit at the end of the bar and fold into a menu on narrow screens. */
  links?: HandoffNavLink[];
  /** One quieter action after the links, like "Log in", drawn as an outlined pill. */
  action?: HandoffNavLink;
  /** Pixels of scroll before the bar docks into the pill. */
  dockAt?: number;
  /** Seconds the bar takes to tighten into the pill. Spreading out again at the top stays a little quicker. */
  dockDuration?: number;
  /** Seconds the hero's button takes to fly into the pill. The flight home scales with it. */
  catchDuration?: number;
  /** How much the caught button overshoots its slot and settles, from 0 (none) up. */
  catchBounce?: number;
  /** The element that scrolls, when it isn't the window. The nav then sticks to the top of that box: put it first inside it. */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Classes for the docked pill's surface: its fill, border and shadow. */
  surfaceClassName?: string;
}

export interface HandoffNavCtaProps {
  /** The button's label. The same content is drawn in the nav once it's caught. */
  children: React.ReactNode;
  /** Where the button goes. Without it, it's a `<button>`. */
  href?: string;
  /** Called when either copy is clicked, in the hero or in the nav. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Classes for both copies. Target one with `data-[placement=hero]:` or `data-[placement=nav]:`. */
  className?: string;
}

/* ── CtaButton ──────────────────────────────────────────── */

// The button itself, drawn in the hero and again in the nav. Its contents sit in one span, so the
// label keeps its size and only the button around it changes during a flight.
function CtaButton({
  cta,
  placement,
  className,
  ref,
  labelRef,
}: {
  cta: Cta;
  placement: "hero" | "nav";
  className?: string;
  ref?: React.Ref<HTMLElement>;
  labelRef?: React.Ref<HTMLSpanElement>;
}) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-sm text-base font-medium whitespace-nowrap",
    `bg-neutral-darkest text-white transition-[background-color,scale] ${TIMING.press} hover:bg-neutral-darker active:scale-[0.97]`,
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-darkest",
    placement === "hero" ? "h-11 px-5" : "h-8 px-3.5",
    cta.className,
    className,
  );
  const label = (
    <span ref={labelRef} className="inline-flex items-center gap-1.5">
      {cta.label}
    </span>
  );
  if (cta.href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={cta.href}
        onClick={cta.onClick}
        data-placement={placement}
        className={classes}
      >
        {label}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={cta.onClick}
      data-placement={placement}
      className={classes}
    >
      {label}
    </button>
  );
}

/* ── HandoffNavProvider ─────────────────────────────────── */

/** Wraps the nav and the hero, so the hero's button can find the nav that catches it. */
export function HandoffNavProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = React.useState(createHandoff);
  return (
    <HandoffContext.Provider value={store}>
      <LazyMotion features={loadMotionFeaturesWhenNeeded}>
        {children}
      </LazyMotion>
    </HandoffContext.Provider>
  );
}

/* ── HandoffNavCta ──────────────────────────────────────── */

/**
 * The hero's call to action. It renders the button where you put it, and when it rides up behind
 * the docked nav, the nav catches it. Its place in the hero stays reserved while it's away.
 */
export function HandoffNavCta({
  children,
  href,
  onClick,
  className,
}: HandoffNavCtaProps) {
  const store = React.useContext(HandoffContext);
  const { away } = useHandoffState(store);
  const reduced = useReducedMotion();
  const homeRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!store) return;
    store.setHome(homeRef.current);
    return () => {
      store.setHome(null);
      store.set({ cta: null, away: false });
    };
  }, [store]);

  React.useEffect(() => {
    store?.set({ cta: { label: children, href, onClick, className } });
  }, [store, children, href, onClick, className]);

  return (
    <span ref={homeRef} className="inline-flex">
      {/* Out of view while the nav holds the button; the span keeps its place in the hero. */}
      <m.span
        className="inline-flex"
        initial={false}
        animate={
          away
            ? { opacity: 0, transitionEnd: { visibility: "hidden" } }
            : { opacity: 1, visibility: "visible" }
        }
        transition={reduced ? TIMING.fade : { duration: 0 }}
      >
        <CtaButton
          cta={{ label: children, href, onClick, className }}
          placement="hero"
        />
      </m.span>
    </span>
  );
}

/* ── HandoffNav ─────────────────────────────────────────── */

/**
 * A navbar that docks into a floating pill once the page scrolls, and catches the hero's
 * `HandoffNavCta` as it slides up behind it.
 */
export function HandoffNav({
  logo,
  links = [],
  action,
  dockAt = 24,
  dockDuration = TIMING.dock.visualDuration,
  catchDuration = TIMING.catch.visualDuration,
  catchBounce = TIMING.catch.bounce,
  containerRef,
  surfaceClassName,
  className,
  ...props
}: HandoffNavProps) {
  const store = React.useContext(HandoffContext);
  const { cta } = useHandoffState(store);
  const hasCta = cta !== null;
  const reduced = useReducedMotion();
  const panelId = React.useId();

  const [mode, setMode] = React.useState<Mode>({
    docked: false,
    caught: false,
    open: false,
    why: "dock",
  });
  const [sizes, setSizes] = React.useState<Sizes | null>(null);
  const [hover, setHover] = React.useState({
    x: 0,
    w: 0,
    on: false,
    jump: true,
  });

  const modeRef = React.useRef(mode);
  const sizesRef = React.useRef<Sizes | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const pillRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLSpanElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const slotRef = React.useRef<HTMLDivElement>(null);
  const flyerRef = React.useRef<HTMLElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const flight = React.useRef<{
    controls: AnimationPlaybackControls | null;
    rect: Rect | null;
  }>({
    controls: null,
    rect: null,
  });
  const reducedRef = React.useRef(reduced);

  React.useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const commit = React.useCallback((next: Mode) => {
    modeRef.current = next;
    setMode(next);
  }, []);

  const setOpen = React.useCallback(
    (open: boolean) => {
      if (modeRef.current.open === open) return;
      commit({ ...modeRef.current, open, why: open ? "open" : "close" });
    },
    [commit],
  );

  // Measure what the pill has to hold. The links and the action keep their own widths whatever
  // the pill is doing, so the docked width is a sum and never a guess.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const flyer = flyerRef.current;
      const label = labelRef.current;
      // The label keeps its own width during a flight, so this holds even mid-air.
      let cta = 0;
      if (flyer && label) {
        const style = getComputedStyle(flyer);
        cta =
          label.offsetWidth +
          parseFloat(style.paddingLeft) +
          parseFloat(style.paddingRight);
      }
      const next: Sizes = {
        rest: track.clientWidth,
        logo: logoRef.current?.offsetWidth ?? 0,
        group: groupRef.current?.offsetWidth ?? 0,
        menu: menuRef.current?.offsetWidth ?? 0,
        cta,
      };
      // The menu button is gone once the links fit: a menu left open would have nothing to hold.
      if (!next.menu && modeRef.current.open) setOpen(false);
      const prev = sizesRef.current;
      if (
        prev &&
        prev.rest === next.rest &&
        prev.logo === next.logo &&
        prev.group === next.group &&
        prev.menu === next.menu &&
        prev.cta === next.cta
      )
        return;
      sizesRef.current = next;
      setSizes(next);
    };
    // The observer reports each element once on observe, which is the first measure.
    let live = true;
    const observer = new ResizeObserver(measure);
    for (const element of [
      track,
      logoRef.current,
      groupRef.current,
      menuRef.current,
      labelRef.current,
    ]) {
      if (element) observer.observe(element);
    }
    document.fonts?.ready.then(() => {
      if (live) measure();
    });
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [hasCta, setOpen]);

  // Watch the scroll: dock past `dockAt`, catch the hero's button when it meets the pill's
  // underside, and send it home once its space is clear again.
  React.useEffect(() => {
    const scroller = containerRef?.current ?? null;
    const source: HTMLElement | Window = scroller ?? window;

    const fly = (to: "nav" | "home") => {
      const engine = getMotionEngine();
      if (!engine) {
        // The engine loads on first scroll; fly as soon as it lands, if still wanted.
        void loadMotionEngine().then(() => {
          if (modeRef.current.caught === (to === "nav")) fly(to);
        });
        return;
      }
      const { animate } = engine;
      const flyer = flyerRef.current;
      const slot = slotRef.current;
      const home = store?.home();
      if (!flyer || !slot || !home || !store) return;
      const sizes = sizesRef.current;
      const navWidth = sizes?.cta || flyer.offsetWidth;
      const navHeight = parseFloat(getComputedStyle(flyer).minHeight) || 32;
      const hadFocus = (to === "nav" ? home : flyer).contains(
        document.activeElement,
      );
      const homeRect = () => toRect(home.getBoundingClientRect());
      // The slot's live rect: the pill may still be docking or widening while the button flies.
      const navRect = (): Rect => {
        const s = slot.getBoundingClientRect();
        return {
          x: s.right - navWidth,
          y: s.top + (s.height - navHeight) / 2,
          w: navWidth,
          h: navHeight,
        };
      };
      const place = (r: Rect) => {
        flight.current.rect = r;
        const s = slot.getBoundingClientRect();
        flyer.style.transform = `translate(${r.x - (s.right - r.w)}px, ${r.y - s.top}px)`;
        flyer.style.width = `${r.w}px`;
        flyer.style.height = `${r.h}px`;
      };
      const settle = () => {
        flyer.style.transform = "";
        flyer.style.width = "";
        flyer.style.height = "";
      };

      flight.current.controls?.stop();
      flight.current.controls = null;

      const viewTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const viewBottom = scroller
        ? scroller.getBoundingClientRect().bottom
        : window.innerHeight;
      const from =
        flight.current.rect ?? (to === "nav" ? homeRect() : navRect());
      const offscreen = from.y + from.h < viewTop || from.y > viewBottom;

      if (reducedRef.current || (offscreen && !flight.current.rect)) {
        // Nothing crosses the page: the copy fades in (or out) in its slot.
        flight.current.rect = null;
        settle();
        if (to === "nav") {
          flyer.style.opacity = "0";
          flyer.style.visibility = "visible";
          store.set({ away: true });
          // Without reduced motion the slot is still opening: wait until it has room.
          const fading = animate(
            flyer,
            { opacity: [0, 1] },
            { ...TIMING.fade, delay: reducedRef.current ? 0 : TIMING.slotWait },
          );
          flight.current.controls = fading;
          fading.then(() => {
            if (flight.current.controls === fading)
              flight.current.controls = null;
          });
          if (hadFocus) flyer.focus({ preventScroll: true });
        } else {
          store.set({ away: false });
          const fading = animate(flyer, { opacity: [1, 0] }, TIMING.fade);
          flight.current.controls = fading;
          fading.then(() => {
            if (flight.current.controls !== fading) return;
            flight.current.controls = null;
            if (!modeRef.current.caught) flyer.style.visibility = "";
          });
          if (hadFocus)
            home
              .querySelector<HTMLElement>("a,button")
              ?.focus({ preventScroll: true });
        }
        return;
      }

      // Put the copy exactly over its starting point first, then hide the original, so the hand
      // between the two is invisible.
      flyer.style.opacity = "1";
      flyer.style.visibility = "visible";
      place(from);
      if (to === "nav") {
        store.set({ away: true });
        if (hadFocus) flyer.focus({ preventScroll: true });
      }
      const target = to === "nav" ? navRect : homeRect;
      const controls = animate(0, 1, {
        ...(to === "nav"
          ? {
              ...TIMING.catch,
              visualDuration: catchDuration,
              bounce: catchBounce,
            }
          : {
              ...TIMING.release,
              visualDuration:
                TIMING.release.visualDuration *
                (catchDuration / TIMING.catch.visualDuration),
            }),
        onUpdate: (t) => place(flightRect(from, target(), t, to)),
        onComplete: () => {
          if (flight.current.controls !== controls) return;
          flight.current.controls = null;
          flight.current.rect = null;
          if (to === "nav") {
            settle();
            return;
          }
          store.set({ away: false });
          // A frame or two with both drawn in the same spot, never a frame with neither.
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              if (modeRef.current.caught || flight.current.controls) return;
              settle();
              flyer.style.visibility = "";
              if (hadFocus)
                home
                  .querySelector<HTMLElement>("a,button")
                  ?.focus({ preventScroll: true });
            }),
          );
        },
      });
      flight.current.controls = controls;
    };

    let frame = 0;
    const check = () => {
      frame = 0;
      const top = scroller ? scroller.scrollTop : window.scrollY;
      const docked = top > dockAt;
      const prev = modeRef.current;
      let caught = prev.caught;
      const home = store?.home();
      if (!store || !store.get().cta || !home) {
        caught = false;
      } else {
        const r = home.getBoundingClientRect();
        const line =
          (scroller ? scroller.getBoundingClientRect().top : 0) +
          NAV.top +
          NAV.docked;
        if (!docked || (r.width === 0 && r.height === 0)) caught = false;
        else if (!caught && r.top < line) caught = true;
        else if (caught && r.top > line + NAV.clear) caught = false;
      }
      if (docked === prev.docked && caught === prev.caught) return;
      const why: Why =
        caught !== prev.caught
          ? caught
            ? "catch"
            : "release"
          : docked
            ? "dock"
            : "undock";
      commit({ ...prev, docked, caught, why });
      if (caught !== prev.caught) fly(caught ? "nav" : "home");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    source.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // A page that loads already scrolled (a restored position) docks and catches straight away.
    onScroll();
    return () => {
      source.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [containerRef, dockAt, store, hasCta, commit, catchDuration, catchBounce]);

  React.useEffect(() => () => flight.current.controls?.stop(), []);

  // The open menu: Esc and a press outside close it, and focus moves into the panel.
  React.useEffect(() => {
    if (!mode.open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    const onDown = (event: PointerEvent) => {
      if (!pillRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    const frame = requestAnimationFrame(() =>
      panelRef.current
        ?.querySelector<HTMLElement>("a")
        ?.focus({ preventScroll: true }),
    );
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(frame);
    };
  }, [mode.open, setOpen]);

  const surface = mode.docked || mode.open;
  const caught = mode.caught && hasCta;
  const slotWidth = caught && sizes ? NAV.slotGap + sizes.cta : 0;
  // On narrow screens (menu icon showing) the docked bar keeps the full width.
  const dockedWidth = sizes?.menu
    ? sizes.rest
    : sizes
      ? Math.min(
          sizes.rest,
          NAV.padStart +
            sizes.logo +
            NAV.gap +
            sizes.group +
            slotWidth +
            sizes.menu +
            NAV.padEnd,
        )
      : 0;
  // An open menu keeps the pill's width, so the close button stays under the finger that opened it.
  const width = !sizes ? "100%" : mode.docked ? dockedWidth : sizes.rest;
  // The slot opens ahead of a caught button and closes just behind a released one.
  const move = reduced
    ? { duration: 0 }
    : mode.why === "catch"
      ? TIMING.make
      : mode.why === "release"
        ? TIMING.shut
        : mode.why === "dock"
          ? { ...TIMING.dock, visualDuration: dockDuration }
          : mode.why === "undock"
            ? {
                ...TIMING.undock,
                visualDuration:
                  TIMING.undock.visualDuration *
                  (dockDuration / TIMING.dock.visualDuration),
              }
            : TIMING[mode.why];
  const panelMove = reduced
    ? { duration: 0 }
    : mode.open
      ? TIMING.open
      : TIMING.close;
  // A menu row: it rises into place, or with reduced motion only fades (its rise jumps).
  const rowMove = (delay: number) =>
    reduced
      ? { default: { duration: 0 }, opacity: { ...TIMING.fade, delay } }
      : { ...(mode.open ? TIMING.open : TIMING.close), delay };

  return (
    <header
      {...props}
      data-caught={mode.caught}
      className={cn(
        "group/handoff-nav pointer-events-none z-50 block h-16",
        containerRef ? "sticky top-0" : "relative",
        className,
      )}
    >
      <div
        className={cn(
          "@container/handoff-nav inset-x-0 top-0",
          containerRef ? "absolute" : "fixed z-50",
        )}
      >
        <div className="mx-auto w-full max-w-[var(--handoff-nav-width,72rem)] px-3 @xl/handoff-nav:px-6">
          <div ref={trackRef} className="w-full">
            <m.div
              ref={pillRef}
              className="pointer-events-auto relative mx-auto"
              initial={false}
              animate={{ width, y: surface ? NAV.top : 0 }}
              transition={move}
            >
              <m.div
                aria-hidden
                className={cn(
                  "border-border absolute inset-0 rounded-lg border bg-white/95 shadow-sm backdrop-blur-xl",
                  surfaceClassName,
                )}
                initial={false}
                animate={{ opacity: surface ? 1 : 0 }}
                transition={TIMING.fill}
              />

              <m.nav
                aria-label="Main"
                className="relative flex items-center"
                initial={false}
                animate={{
                  height: surface ? NAV.docked : NAV.rest,
                  paddingLeft: surface ? NAV.padStart : 0,
                  paddingRight: surface ? NAV.padEnd : 0,
                }}
                transition={move}
              >
                <div ref={logoRef} className="flex shrink-0 items-center">
                  {logo}
                </div>

                <div className="ml-auto flex shrink-0 items-center">
                  <div
                    ref={groupRef}
                    className="hidden shrink-0 items-center gap-1 @2xl/handoff-nav:flex"
                    onPointerLeave={() =>
                      setHover((h) => ({ ...h, on: false }))
                    }
                  >
                    {links.length > 0 && (
                      <div className="relative flex items-center">
                        <m.span
                          aria-hidden
                          className="pointer-events-none absolute top-0 left-0 h-8 rounded-full bg-zinc-950/[0.05] dark:bg-white/[0.08]"
                          initial={false}
                          animate={{
                            x: hover.x,
                            width: hover.w,
                            opacity: hover.on ? 1 : 0,
                          }}
                          transition={
                            hover.jump || reduced
                              ? {
                                  x: { duration: 0 },
                                  width: { duration: 0 },
                                  opacity: TIMING.fade,
                                }
                              : {
                                  x: TIMING.hover,
                                  width: TIMING.hover,
                                  opacity: TIMING.fade,
                                }
                          }
                        />
                        {links.map((link) => (
                          <a
                            key={link.href + link.label}
                            href={link.href}
                            onPointerEnter={(event) => {
                              if (event.pointerType !== "mouse") return;
                              const el = event.currentTarget;
                              setHover((h) => ({
                                x: el.offsetLeft,
                                w: el.offsetWidth,
                                on: true,
                                jump: !h.on,
                              }));
                            }}
                            className={`relative flex h-8 items-center rounded-full px-3 text-base text-zinc-600 transition-colors ${TIMING.color} hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:text-zinc-400 dark:hover:text-white dark:focus-visible:outline-white`}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                    {action && (
                      <a
                        href={action.href}
                        className={`ml-1 flex h-8 items-center rounded-full border border-zinc-950/10 px-3.5 text-base font-medium text-zinc-900 transition-colors ${TIMING.color} hover:bg-zinc-950/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-white/15 dark:text-zinc-100 dark:hover:bg-white/[0.06] dark:focus-visible:outline-white`}
                      >
                        {action.label}
                      </a>
                    )}
                  </div>

                  {cta && (
                    <m.div
                      ref={slotRef}
                      className="relative h-8 shrink-0"
                      initial={false}
                      animate={{ width: slotWidth }}
                      transition={move}
                    >
                      <CtaButton
                        ref={flyerRef}
                        labelRef={labelRef}
                        cta={cta}
                        placement="nav"
                        className="invisible absolute top-0 right-0 min-h-8"
                      />
                    </m.div>
                  )}

                  <span
                    ref={menuRef}
                    className={cn(
                      "flex shrink-0 pl-1 @2xl/handoff-nav:hidden",
                      !links.length && !action && "hidden",
                    )}
                  >
                    <button
                      ref={menuButtonRef}
                      type="button"
                      aria-expanded={mode.open}
                      aria-controls={panelId}
                      aria-label={mode.open ? "Close menu" : "Open menu"}
                      onClick={() => setOpen(!modeRef.current.open)}
                      className={cn(
                        "text-neutral-darkest hover:bg-neutral-darkest/5 relative grid h-10 place-items-center rounded-sm transition-[width,background-color] ease-in-out focus-visible:outline-2 focus-visible:outline-current motion-reduce:transition-none",
                        MENU_ICON.shrinkClass,
                        surface ? "w-9" : "w-12",
                      )}
                    >
                      {[-1, 1].map((side) => (
                        <m.span
                          key={side}
                          aria-hidden
                          className="absolute h-px rounded-full bg-current shadow-[0_0.5px_0_0_currentColor]"
                          initial={false}
                          animate={{
                            width: surface ? MENU_ICON.short : MENU_ICON.long,
                            y: mode.open ? 0 : side * MENU_ICON.gap,
                            rotate: mode.open ? side * -45 : 0,
                          }}
                          transition={
                            reduced
                              ? { duration: 0 }
                              : mode.open
                                ? MENU_ICON.open
                                : MENU_ICON.close
                          }
                        />
                      ))}
                    </button>
                  </span>
                </div>
              </m.nav>

              <m.div
                id={panelId}
                ref={panelRef}
                className="relative overflow-hidden"
                initial={false}
                animate={{ height: mode.open ? "auto" : 0 }}
                transition={panelMove}
                inert={!mode.open}
              >
                <ul className="flex flex-col px-2 pt-1 pb-2">
                  {links.map((link, index) => (
                    <m.li
                      key={link.href + link.label}
                      initial={false}
                      animate={
                        mode.open
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: -NAV.rise }
                      }
                      transition={rowMove(
                        mode.open
                          ? TIMING.stagger * (index + 1)
                          : TIMING.tuck * (links.length - 1 - index),
                      )}
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex h-11 items-center rounded-2xl px-3 text-[15px] text-zinc-800 transition-colors ${TIMING.color} hover:bg-zinc-950/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-950 dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:focus-visible:outline-white`}
                      >
                        {link.label}
                      </a>
                    </m.li>
                  ))}
                  {action && (
                    <m.li
                      className="mt-1 px-1"
                      initial={false}
                      animate={
                        mode.open
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: -NAV.rise }
                      }
                      transition={rowMove(
                        mode.open ? TIMING.stagger * (links.length + 1) : 0,
                      )}
                    >
                      <a
                        href={action.href}
                        onClick={() => setOpen(false)}
                        className={`flex h-11 items-center justify-center rounded-full border border-zinc-950/10 text-[15px] font-medium text-zinc-900 transition-colors ${TIMING.color} hover:bg-zinc-950/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-white/15 dark:text-zinc-100 dark:hover:bg-white/[0.06] dark:focus-visible:outline-white`}
                      >
                        {action.label}
                      </a>
                    </m.li>
                  )}
                </ul>
              </m.div>
            </m.div>
          </div>
        </div>
      </div>
    </header>
  );
}
