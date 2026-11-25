"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  motion,
  motionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Keep:
 * - Words, answers, option labels and blocks move by FLIP on motion values written straight to
 *   `transform`: snapshot before a change, measure after the commit, spring home. Nothing
 *   re-renders per frame.
 * - A picked label flies from its chip scaled uniformly, so its text never stretches. A line shifts
 *   as one piece; a word that no longer fits slides off one end and in at the other, never across
 *   the lines between.
 * - While you type, words that stay on their line move with the text at once and only a word that
 *   changes lines hops, so a new letter never covers the next word.
 * - Leaving elements fade or fold as inert clones in the layer under the sentence, and fades use
 *   explicit `[0, 1]` keyframes, since motion skips a 1 → 1 fade.
 * - Under reduced motion nothing flies, glides or shakes: things take their places at once and
 *   only fade.
 */
const TIMING = {
  /**
   * The spring flights and the reflow around them run on: `visualDuration` in seconds (the
   * `duration` prop) and `bounce` (the `bounce` prop).
   */
  flow: { type: "spring", visualDuration: 0.45, bounce: 0 },
  /** A word hopping lines while you type. */
  typed: { type: "spring", visualDuration: 0.22, bounce: 0 },
  /**
   * After a pick-one choice before focus moves on, in ms at the default `duration`: about when its
   * flight lands. It scales with `duration`.
   */
  beat: 380,
  /** A word appearing waits for the words leaving its spot to clear, in seconds. */
  settle: 0.14,
  /** Between words rising into a clause, in seconds. */
  stagger: 0.045,
  /** Between options arriving in the tray, in seconds. */
  options: 0.03,
  /** Fades: words, the highlight, the tray, and everything under reduced motion. */
  fade: { duration: 0.2, ease: "easeOut" },
  /** A leaving word folding away, in ms, and its curve. */
  fold: { duration: 200, easing: "cubic-bezier(0.4, 0, 0.9, 0.6)" },
  /** An underline growing in or retracting, in seconds, and its curve. */
  underline: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  /**
   * A word wrapping to another line, in seconds: its old copy fading as it slides off the end of
   * its line, and the word fading in at the other end of the next.
   */
  wrap: { out: 0.32, outEase: "easeIn", in: 0.3, inEase: "easeOut" },
  /** The same while you type, when a word just hops into its new place, in seconds. */
  typedWrap: { out: 0.14, outEase: "easeOut", in: 0.18 },
  /** An invalid blank shaking, in seconds, and its curve. */
  shake: { duration: 0.42, ease: "easeOut" },
  /** The send button or the confirmation rising in, after the words, in seconds; and leaving. */
  actionsDelay: 0.12,
  leave: { duration: 0.15 },
  /** A tray arriving just after the last blank's tray has faded, in seconds; and fading. */
  trayDelay: 0.1,
  trayOut: { duration: 0.1 },
  /** The send button's hover and press, its arrow's nudge and a chip's hover, as Tailwind classes. */
  press: "duration-200 ease-out",
  nudge: "duration-200 ease-out",
  chip: "duration-200 ease-out",
  /** An underline changing color and thickness, as a Tailwind class. */
  underlineStyle: "duration-200",
  /** A picked chip's imprint fading in once its label has flown, as Tailwind classes. */
  imprint: "delay-200 duration-300",
} as const;

/* ─────────────────────────────────────────────────────────
 * SENTENCE FORM STORYBOARD
 *
 *  rest     a sentence with blanks in it, wrapping like any text.
 *           An empty blank shows a muted hint on a dotted underline
 *  focus    a soft highlight settles on the blank you're in and
 *           glides to the next one as you move. Its underline
 *           darkens and thickens. The tray under the sentence
 *           names the blank, gives a hint and shows its options,
 *           swapping them on a short stagger
 *  type     a text blank stretches with its text, keeping its
 *           placeholder's room while you're in it. Words on their
 *           line are pushed along at once; a word bumped to another
 *           line hops into place. Leaving the blank lets it tighten
 *           to its text, and the words after it glide back
 *  pick     the option's label flies up out of its chip into the
 *           blank, growing to the sentence's size without
 *           stretching, while the words after it glide aside on
 *           the same spring. Each line shifts as one piece; a word
 *           that no longer fits slides off the end of its line and
 *           in at the start of the next, never across the lines in
 *           between. The chip keeps an outline with a faint imprint
 *           of the label; tap it to send the pick back down
 *  swap     picking another option in a pick-one blank flies the
 *           new one up as the old one drops back into its outline.
 *           A beat later, focus moves on to the next empty blank
 *  clause   words that appear rise in one after another once the
 *           words after them have made room; words that go fold
 *           away and the gap closes
 *  invalid  on send, the first blank that needs attention takes
 *           focus, turns red and shakes, and the tray says why
 *  pending  the button shows it's sending and the blanks hold still
 *  sent     underlines retract, hints go, and the answers become
 *           plain words that wrap like the rest, so the form settles
 *           into the note you wrote. A confirmation rises where the
 *           button was
 *  edit     the same choreography in reverse, with every answer kept
 *  keys     Tab moves through the blanks. Enter, Space or ↓ on a
 *           pick blank moves into its options: arrows move, Enter
 *           or Space picks (in a pick-any blank Space toggles and
 *           Enter finishes). Esc goes back to the blank, Tab on to
 *           the next. Enter in a text blank goes to the next empty
 *           blank, or sends when none are left
 *  touch    options are full-size tap targets, and the active blank
 *           and its tray keep themselves in view above the keyboard
 *  reduced  nothing flies, glides or shakes: things take their
 *           places at once and only fade
 * ───────────────────────────────────────────────────────── */

const SENTENCE = {
  hop: 0.5, // em a word hopping lines while you type travels
  rise: 0.4, // em a word in a new clause rises from
  shake: [0, -7, 6, -4, 2, 0], // px
  space: 0.25, // em, about one word space, for placing an answer's words as it splits up
  glow: { x: 0.14, y: 0.02 }, // em the highlight reaches past its blank
} as const;

/* ── Types ──────────────────────────────────────────────── */

/** A string per blank, or a string[] for blanks with `multiple`. */
export type SentenceFormValues = Record<string, string | string[]>;

/** An option is its label, or `{ value, label }` when the submitted value differs. */
export type SentenceFormOption = string | { value: string; label: string };

type Option = { value: string; label: string };
type Field = Omit<SentenceFormFieldProps, "options"> & { options?: Option[] };
type FieldError = { kind: "required" | "format"; message: string };
type Status = "editing" | "pending" | "sent" | "failed";

/* ── Reading the sentence ───────────────────────────────── */

// The sentence is flattened into atoms (words, other elements and fields)
// with a null wherever there was whitespace, so a line may break there.
// Atoms that touch with no space between them ("." after a blank) are kept
// together. Ids come from where an atom sits in the JSX, so a clause that
// appears doesn't change the ids of the words after it.

type Atom =
  | { kind: "text"; id: string; text: string }
  | { kind: "node"; id: string; node: React.ReactElement }
  | { kind: "field"; id: string; field: Field };
type Flow = (Atom | null)[];

const toOption = (option: SentenceFormOption): Option =>
  typeof option === "string" ? { value: option, label: option } : option;

function walk(node: React.ReactNode, path: string, out: Flow) {
  if (node == null || typeof node === "boolean") return;
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "bigint"
  ) {
    String(node)
      .split(/(\s+)/)
      .forEach((bit, i) => {
        if (bit)
          out.push(
            /^\s/.test(bit)
              ? null
              : { kind: "text", id: `${path}:${i}`, text: bit },
          );
      });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child, i) => {
      const key =
        React.isValidElement(child) && child.key != null ? `$${child.key}` : i;
      walk(child, `${path}.${key}`, out);
    });
    return;
  }
  if (!React.isValidElement(node)) return;
  if (node.type === React.Fragment) {
    walk((node.props as { children?: React.ReactNode }).children, path, out);
    return;
  }
  if (node.type === SentenceFormField) {
    const props = node.props as SentenceFormFieldProps;
    out.push({
      kind: "field",
      id: `f:${props.name}`,
      field: { ...props, options: props.options?.map(toOption) },
    });
    return;
  }
  out.push({ kind: "node", id: path, node });
}

function parse(content: React.ReactNode) {
  const raw: Flow = [];
  walk(content, "s", raw);
  const flow: Flow = [];
  for (const atom of raw) {
    if (atom === null && (flow.length === 0 || flow[flow.length - 1] === null))
      continue;
    flow.push(atom);
  }
  if (flow[flow.length - 1] === null) flow.pop();
  const fields = flow.flatMap((atom) =>
    atom?.kind === "field" ? [atom.field] : [],
  );
  return { flow, fields };
}

/** Splits a flow at its spaces into runs that can't be broken. */
function group<T extends { id: string }>(flow: (T | null)[]) {
  const units: { key: string; atoms: T[] }[] = [];
  let run: T[] = [];
  const close = () => {
    if (run.length) units.push({ key: run[0].id, atoms: run });
    run = [];
  };
  for (const atom of flow) {
    if (atom === null) close();
    else run.push(atom);
  }
  close();
  return units;
}

/**
 * What a screen reader hears between the controls. The visible words are
 * split up for the animation and hidden from assistive tech; these runs put
 * the sentence back together around the fields.
 */
function speech(flow: Flow, said: (field: Field) => string | null) {
  const before = new Map<string, string>();
  let text = "";
  for (const atom of flow) {
    if (atom === null) text += " ";
    else if (atom.kind === "text") text += atom.text;
    else {
      const words = atom.kind === "field" ? said(atom.field) : null;
      if (words !== null) {
        text += words;
        continue;
      }
      before.set(atom.id, text.trim());
      text = "";
    }
  }
  return { before, after: text.trim() };
}

const formats = new Map<string, Intl.ListFormat>();
function listFormat(locale: string) {
  let format = formats.get(locale);
  if (!format) {
    format = new Intl.ListFormat(locale, {
      style: "long",
      type: "conjunction",
    });
    formats.set(locale, format);
  }
  return format;
}

type ListBit =
  | { kind: "pick"; id: string; value: string; label: string }
  | { kind: "word"; id: string; text: string };

/**
 * A pick-any blank's answer as words: its picks joined with the locale's
 * list grammar. Punctuation that touches a pick is keyed to that pick; the
 * free-standing words ("and") are keyed by count, so the "and" glides along
 * as picks are added instead of fading out and back in.
 */
function listBits(
  field: Field,
  picks: string[],
  locale: string,
): (ListBit | null)[] {
  const parts = listFormat(locale).formatToParts(
    picks.map((value) => labelOf(field, value)),
  );
  const out: (ListBit | null)[] = [];
  let n = 0;
  let free = 0;
  let previous = "";
  for (const part of parts) {
    if (part.type === "element") {
      previous = picks[n++];
      out.push({
        kind: "pick",
        id: `f:${field.name}:v:${previous}`,
        value: previous,
        label: part.value,
      });
      continue;
    }
    let touching = true;
    part.value.split(/(\s+)/).forEach((bit, i) => {
      if (!bit) return;
      if (/^\s/.test(bit)) {
        out.push(null);
        touching = false;
        return;
      }
      const id = touching
        ? `f:${field.name}:after:${previous}:${i}`
        : `f:${field.name}:and:${free++}`;
      out.push({ kind: "word", id, text: bit });
    });
  }
  return out;
}

/** The next empty blank after this one, or else a required one before it. */
function nextEmpty(
  from: string,
  fields: Field[],
  valueOf: (name: string) => string | string[],
) {
  const i = fields.findIndex((field) => field.name === from);
  const empty = (field: Field) => isEmpty(valueOf(field.name));
  return (
    fields.slice(i + 1).find(empty) ??
    fields
      .slice(0, Math.max(i, 0))
      .find((field) => field.required && empty(field))
  )?.name;
}

const labelOf = (field: Field, value: string) =>
  field.options?.find((option) => option.value === value)?.label ?? value;

const isEmpty = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.length === 0 : !value?.trim();

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function looksLikeUrl(text: string) {
  try {
    return new URL(
      /^[a-z][\w+.-]*:/i.test(text) ? text : `https://${text}`,
    ).hostname.includes(".");
  } catch {
    return false;
  }
}

function check(
  field: Field,
  value: string | string[],
  typing: boolean,
): FieldError | null {
  if (Array.isArray(value)) {
    return field.required && value.length === 0
      ? { kind: "required", message: "Pick at least one to send." }
      : null;
  }
  const text = value.trim();
  if (!text) {
    if (!field.required) return null;
    if (field.options && !typing)
      return { kind: "required", message: "Pick one to send." };
    return { kind: "required", message: "Fill this in to send." };
  }
  if (field.type === "email" && !EMAIL.test(text)) {
    return {
      kind: "format",
      message: "That doesn't look like an email address.",
    };
  }
  if (field.type === "url" && !looksLikeUrl(text)) {
    return { kind: "format", message: "That doesn't look like a web address." };
  }
  return null;
}

/* ── Motion engine ──────────────────────────────────────── */

// Every word, answer, option label and the blocks under the sentence are
// registered here by id. A change snapshots where everything is on screen;
// after React commits, each element is measured at its new place and moved
// back to where it was, then springs home (FLIP). A new element whose
// partner just left (an option label and the answer it becomes) flies from
// the partner's spot instead, scaled uniformly so its text never stretches.
// Elements that leave are cloned into a layer under the sentence to fade or
// fold away. Layout changes without a snapshot (a resize, a late font) just
// reflow.

type Kind = "word" | "chip" | "block";
type Enter = "rise" | "fade" | "none";
type Exit = "fold" | "fade" | "none";
type Mode = "flow" | "type";
type Box = { left: number; top: number; width: number; height: number };
type PieceOptions = {
  kind: Kind;
  partner?: string;
  origin?: string;
  enter: Enter;
  exit: Exit;
};
type Entry = PieceOptions & {
  id: string;
  el: HTMLElement;
  x: MotionValue<number>;
  y: MotionValue<number>;
  s: MotionValue<number>;
  /** While a word slides in at the start or end of a line: the text column's edges, in its own coordinates. */
  clip?: { left: number; right: number; width: number };
  dispose: () => void;
};
type Seen = { box: Box; layout: Box; font: number };
type Glow = {
  el: HTMLElement;
  x: MotionValue<number>;
  y: MotionValue<number>;
  w: MotionValue<number>;
  h: MotionValue<number>;
  o: MotionValue<number>;
  target: Box | null;
  dispose: () => void;
};

/** The spring flights and the reflow around them run on, from `duration` and `bounce`. */
type Spring = { type: "spring"; visualDuration: number; bounce: number };

const middle = (box: Box) => ({
  x: box.left + box.width / 2,
  y: box.top + box.height / 2,
});
const fontOf = (el: Element) => parseFloat(getComputedStyle(el).fontSize) || 16;

function createEngine() {
  const entries = new Map<string, Entry>();
  const departed = new Map<string, Entry>();
  let root: HTMLElement | null = null;
  let layer: HTMLElement | null = null;
  let glows: Glow[] = [];
  let snap: { mode: Mode; field?: string; seen: Map<string, Seen> } | null =
    null;
  let reduced = false;
  let spring: Spring = TIMING.flow;
  let active: string | null = null;

  const boxOf = (el: Element, base: DOMRect): Box => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left - base.left,
      top: r.top - base.top,
      width: r.width,
      height: r.height,
    };
  };

  const paint = (e: Entry) => {
    const x = e.x.get();
    const y = e.y.get();
    const s = e.s.get();
    e.el.style.transform =
      x || y || s !== 1 ? `translate(${x}px, ${y}px) scale(${s})` : "";
    if (e.clip) {
      const left = Math.max(0, e.clip.left - x);
      const right = Math.max(0, e.clip.width - (e.clip.right - x));
      e.el.style.clipPath =
        left > 0.5 || right > 0.5 ? `inset(0 ${right}px 0 ${left}px)` : "";
    }
  };

  const unclip = (e: Entry) => {
    if (!e.clip) return;
    e.clip = undefined;
    e.el.style.clipPath = "";
  };

  /** The element's box as laid out, without its own offset. */
  const laidOut = (e: Entry, base: DOMRect): Box => {
    const box = boxOf(e.el, base);
    const s = e.s.get() || 1;
    const c = middle(box);
    const width = box.width / s;
    const height = box.height / s;
    return {
      left: c.x - e.x.get() - width / 2,
      top: c.y - e.y.get() - height / 2,
      width,
      height,
    };
  };

  function flush() {
    for (const e of departed.values()) e.dispose();
    departed.clear();
  }

  function attach(id: string, el: HTMLElement) {
    const old = departed.get(id);
    if (old) departed.delete(id);
    const detach = (entry: Entry) => () => {
      if (entries.get(id) !== entry) return;
      entries.delete(id);
      departed.set(id, entry);
    };
    if (old?.el === el) {
      // The same element came straight back (Strict Mode remounts effects): keep it moving.
      entries.set(id, old);
      return detach(old);
    }
    old?.dispose();
    const x = motionValue(0);
    const y = motionValue(0);
    const s = motionValue(1);
    const entry: Entry = {
      id,
      el,
      x,
      y,
      s,
      kind: "word",
      enter: "none",
      exit: "none",
      dispose: () => {},
    };
    const draw = () => paint(entry);
    const off = [
      x.on("change", draw),
      y.on("change", draw),
      s.on("change", draw),
    ];
    entry.dispose = () => {
      x.stop();
      y.stop();
      s.stop();
      off.forEach((stop) => stop());
    };
    entries.set(id, entry);
    return detach(entry);
  }

  function configure(id: string, options: PieceOptions) {
    const entry = entries.get(id);
    if (entry) Object.assign(entry, options);
  }

  /** Call right before a change that moves things: records where everything is on screen. */
  function snapshot(mode: Mode, field?: string) {
    if (!root) return;
    if (snap) {
      if (mode === "flow") snap.mode = "flow";
      return;
    }
    flush();
    const base = root.getBoundingClientRect();
    const seen = new Map<string, Seen>();
    for (const e of entries.values()) {
      seen.set(e.id, {
        box: boxOf(e.el, base),
        layout: laidOut(e, base),
        font: e.kind === "chip" || e.partner ? fontOf(e.el) : 0,
      });
    }
    const mine = { mode, field, seen };
    snap = mine;
    // A change that never reaches a commit doesn't leave its snapshot behind.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (snap === mine) snap = null;
      }),
    );
  }

  function move(mv: MotionValue<number>, from: number) {
    if (Math.abs(from - mv.get()) < 0.5 && mv.isAnimating()) return; // already on its way there
    if (Math.abs(from) < 0.5) {
      mv.jump(0);
      return;
    }
    const velocity = mv.getVelocity();
    mv.jump(from);
    animate(mv, 0, { ...spring, velocity });
  }

  function glide(e: Entry, dx: number, dy: number) {
    unclip(e);
    if (reduced) {
      e.x.jump(0);
      e.y.jump(0);
      return;
    }
    move(e.x, dx);
    move(e.y, dy);
  }

  function fadeIn(e: Entry, delay = 0) {
    // Explicit keyframes: motion remembers an element's last opacity and would skip a 1 → 1 "fade".
    e.el.style.opacity = "0";
    animate(e.el, { opacity: [0, 1] }, { ...TIMING.fade, delay });
  }

  function fly(
    e: Entry,
    from: Seen,
    to: Box,
    carried: { x: number; y: number },
  ) {
    if (reduced) return fadeIn(e);
    const font = fontOf(e.el);
    const a = middle(from.box);
    const b = middle(to);
    e.x.jump(a.x - b.x - carried.x);
    e.y.jump(a.y - b.y - carried.y);
    e.s.jump(from.font && font ? from.font / font : 1);
    e.el.style.zIndex = "10";
    animate(e.x, 0, spring);
    animate(e.y, 0, spring);
    animate(e.s, 1, spring).then(() => {
      e.el.style.zIndex = "";
    });
    const line = e.el.querySelector<HTMLElement>("[data-underline]");
    if (line)
      animate(
        line,
        { opacity: [0, 1] },
        { ...TIMING.fade, delay: spring.visualDuration * 0.5 },
      );
  }

  function rise(e: Entry, i: number) {
    const delay = TIMING.settle + i * TIMING.stagger;
    fadeIn(e, delay);
    if (reduced) return;
    e.y.jump(SENTENCE.rise * fontOf(e.el));
    animate(e.y, 0, { ...spring, delay });
  }

  function grow(e: Entry) {
    const line = e.el.querySelector<HTMLElement>("[data-underline]");
    if (!line) return;
    if (reduced) animate(line, { opacity: [0, 1] }, TIMING.fade);
    else animate(line, { scaleX: [0, 1] }, TIMING.underline);
  }

  /** A stand-in for an element that's leaving, left where it was in the layer under the sentence. */
  function cloneOf(e: Entry, was: Seen, blank = false) {
    if (!root || !layer) return null;
    const clone = e.el.cloneNode(true) as HTMLElement;
    const sources = e.el.querySelectorAll("input");
    clone.querySelectorAll("input").forEach((input, i) => {
      input.value = blank ? "" : (sources[i]?.value ?? "");
      if (blank) input.placeholder = "";
    });
    for (const node of [clone, ...clone.querySelectorAll("*")]) {
      for (const name of [
        "id",
        "name",
        "data-piece",
        "data-part",
        "data-blank",
      ])
        node.removeAttribute(name);
    }
    clone.inert = true;
    clone.setAttribute("aria-hidden", "true");
    const base = root.getBoundingClientRect();
    const at = layer.getBoundingClientRect();
    Object.assign(clone.style, {
      position: "absolute",
      left: `${was.box.left + base.left - at.left}px`,
      top: `${was.box.top + base.top - at.top}px`,
      width: `${was.box.width}px`,
      height: `${was.box.height}px`,
      margin: "0",
      transform: "",
      zIndex: "",
      opacity: "",
      clipPath: "",
    });
    layer.append(clone);
    return clone;
  }

  function ghost(e: Entry, was: Seen, how: Exit | "underline") {
    const clone = cloneOf(e, was, how === "underline");
    if (!clone) return;
    const done = () => clone.remove();
    const line = clone.querySelector<HTMLElement>("[data-underline]");
    if (how === "underline") {
      clone.style.color = "transparent";
      if (line && !reduced)
        animate(line, { scaleX: 0 }, TIMING.underline).then(done);
      else animate(clone, { opacity: 0 }, TIMING.fade).then(done);
    } else if (how === "fold" && !reduced) {
      clone.style.transformOrigin = "50% 100%";
      clone
        .animate(
          [
            { transform: "perspective(32em) rotateX(0deg)", opacity: 1 },
            {
              transform: "perspective(32em) rotateX(-50deg)",
              opacity: 0.25,
              offset: 0.55,
            },
            { transform: "perspective(32em) rotateX(-82deg)", opacity: 0 },
          ],
          {
            duration: TIMING.fold.duration,
            easing: TIMING.fold.easing,
            fill: "forwards",
          },
        )
        .finished.then(done, done);
    } else {
      animate(clone, { opacity: 0 }, TIMING.fade).then(done);
    }
  }

  /** A word wrapping to another line: its old copy slides off the end of the line it was on... */
  function slideOut(
    e: Entry,
    was: Seen,
    from: number,
    to: number,
    left: number,
    right: number,
    quick: boolean,
  ) {
    const clone = cloneOf(e, was);
    if (!clone) return;
    const x = motionValue(from);
    const l = left - was.box.left;
    const r = right - was.box.left;
    const draw = () => {
      const v = x.get();
      clone.style.transform = `translateX(${v}px)`;
      clone.style.clipPath = `inset(0 ${Math.max(0, was.box.width - (r - v))}px 0 ${Math.max(0, l - v)}px)`;
    };
    x.on("change", draw);
    draw();
    animate(x, to, quick ? TIMING.typed : spring);
    animate(
      clone,
      { opacity: 0 },
      {
        duration: quick ? TIMING.typedWrap.out : TIMING.wrap.out,
        ease: quick ? TIMING.typedWrap.outEase : TIMING.wrap.outEase,
      },
    ).then(() => {
      x.stop();
      clone.remove();
    });
  }

  /** ...and the word itself slides in at the other end of its new line. */
  function slideIn(
    e: Entry,
    from: number,
    clip: NonNullable<Entry["clip"]>,
    quick: boolean,
  ) {
    e.y.jump(0);
    e.clip = clip;
    e.x.jump(from);
    animate(e.x, 0, quick ? TIMING.typed : spring);
    const faded = quick ? 0.3 : 0;
    e.el.style.opacity = String(faded);
    animate(
      e.el,
      { opacity: [faded, 1] },
      {
        duration: quick ? TIMING.typedWrap.in : TIMING.wrap.in,
        ease: TIMING.wrap.inEase,
      },
    );
  }

  function commit(next: string | null) {
    active = next;
    const s = snap;
    snap = null;
    if (!root) return flush();
    if (!s) {
      flush();
      glow(false);
      return;
    }

    const base = root.getBoundingClientRect();
    const list = [...entries.values()].sort((a, b) =>
      a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    );
    for (const e of list) e.el.style.transform = "";
    const layout = new Map(list.map((e) => [e.id, boxOf(e.el, base)] as const));

    // An answer that splits into words as the form settles (or words that join
    // back into an answer) starts out laid along the old one, and from there
    // moves like any other word.
    const splits = new Set<string>();
    const virtual = new Map<string, Seen>();
    const along = new Map<string, number>();
    for (const e of list) {
      if (s.seen.has(e.id) || !e.origin || !departed.has(e.origin)) continue;
      const from = s.seen.get(e.origin);
      if (!from) continue;
      splits.add(e.origin);
      const to = layout.get(e.id)!;
      const x = along.get(e.origin) ?? 0;
      const box = {
        left: from.box.left + x,
        top: from.box.top + (from.box.height - to.height) / 2,
        width: to.width,
        height: to.height,
      };
      virtual.set(e.id, { box, layout: box, font: 0 });
      along.set(e.origin, x + to.width + SENTENCE.space * fontOf(e.el));
    }
    const wasOf = (e: Entry) => s.seen.get(e.id) ?? virtual.get(e.id);

    // An element inside another (an option label inside the tray) rides on its
    // holder's offset, so only the rest of the way is its own.
    const starts = new Map<string, { x: number; y: number }>();
    const carriedBy = (e: Entry) => {
      const holder = e.el.parentElement?.closest<HTMLElement>("[data-piece]");
      return (
        (holder?.dataset.piece && starts.get(holder.dataset.piece)) || {
          x: 0,
          y: 0,
        }
      );
    };

    // Lines move sideways as one piece. For each line: how far the first and
    // last words that stay on it move, so a word wrapping off one line and
    // onto another can travel in step with them.
    const col = layer
      ? boxOf(layer, base)
      : { left: 0, top: 0, width: base.width, height: 0 };
    const left = col.left;
    const right = col.left + col.width;
    const lines: {
      top: number;
      first: number;
      firstShift: number;
      last: number;
      lastShift: number;
    }[] = [];
    const lineAt = (top: number) =>
      lines.find((line) => Math.abs(line.top - top) < 4);
    const crossed = (was: Seen, to: Box) =>
      Math.abs(to.top - was.layout.top) > to.height / 2;
    for (const e of list) {
      const was = wasOf(e);
      const to = layout.get(e.id)!;
      if (e.kind !== "word" || !was || crossed(was, to)) continue;
      const shift = to.left - was.layout.left;
      let line = lineAt(to.top);
      if (!line) {
        line = {
          top: to.top,
          first: Infinity,
          firstShift: 0,
          last: -Infinity,
          lastShift: 0,
        };
        lines.push(line);
      }
      if (to.left < line.first)
        Object.assign(line, { first: to.left, firstShift: shift });
      if (to.left > line.last)
        Object.assign(line, { last: to.left, lastShift: shift });
    }

    // While typing, words that stay on their line move with the text at once,
    // so a new letter never covers the next word; only words that change
    // lines travel. The blank being typed in just goes where it's needed.
    const typing = s.mode === "type";
    const typedUnits = typing
      ? list
          .filter((e) => e.el.dataset.part === s.field)
          .map((e) => e.el.closest("[data-unit]") ?? e.el)
      : [];
    const withTyped = (e: Entry) =>
      typedUnits.some((unit) => unit.contains(e.el));

    // Words that wrap forward (down and back to the start) or back (up to the
    // end of the line before) go off one end and come in at the other, instead
    // of cutting across the lines in between. The ones leaving (or joining) a
    // line move together, far enough for all of them to clear the column.
    const wraps = new Map<string, boolean>();
    const away = new Map<number, number>();
    const enter = new Map<number, number>();
    const rowOf = (rows: Map<number, number>, top: number) => {
      for (const row of rows.keys()) if (Math.abs(row - top) < 4) return row;
      return top;
    };
    for (const e of list) {
      const was = wasOf(e);
      const to = layout.get(e.id)!;
      if (
        reduced ||
        e.kind !== "word" ||
        !was ||
        !crossed(was, to) ||
        e.s.get() !== 1
      )
        continue;
      if (typing && withTyped(e)) continue;
      const forward = to.top > was.layout.top;
      if (forward !== to.left < was.layout.left) continue;
      wraps.set(e.id, forward);
      const out = rowOf(away, was.layout.top);
      const off = forward
        ? right - was.box.left
        : left - was.box.left - was.box.width;
      away.set(
        out,
        forward
          ? Math.max(away.get(out) ?? off, off)
          : Math.min(away.get(out) ?? off, off),
      );
      const row = rowOf(enter, to.top);
      const gap = SENTENCE.space * fontOf(e.el);
      const on = forward
        ? to.left - left + to.width + gap
        : right - to.left + gap;
      enter.set(row, Math.max(enter.get(row) ?? on, on));
    }

    const wrap = (e: Entry, was: Seen, to: Box, forward: boolean) => {
      const from = lineAt(was.layout.top);
      const into = lineAt(to.top);
      const pushed = (forward ? from?.lastShift : from?.firstShift) ?? 0;
      const clip = {
        left: left - to.left,
        right: right - to.left,
        width: to.width,
      };
      if (typing) {
        // Typing moves the rest at once, so a word that changes lines just hops
        // a little into its new place, the way text reflows in an editor.
        slideIn(
          e,
          SENTENCE.hop * fontOf(e.el) * (forward ? -1 : 1),
          clip,
          true,
        );
        return;
      }
      const off = away.get(rowOf(away, was.layout.top)) ?? 0;
      slideOut(
        e,
        was,
        0,
        forward ? Math.max(pushed, off) : Math.min(pushed, off),
        left,
        right,
        false,
      );
      const lead = (forward ? into?.firstShift : into?.lastShift) ?? 0;
      const on = enter.get(rowOf(enter, to.top)) ?? 0;
      slideIn(
        e,
        forward ? -Math.max(lead, on) : Math.max(-lead, on),
        clip,
        false,
      );
    };

    const flown = new Set<string>();
    const risers: Entry[] = [];
    for (const e of list) {
      const to = layout.get(e.id)!;
      const carried = carriedBy(e);
      const was = wasOf(e);
      if (was) {
        if (virtual.has(e.id)) grow(e);
        if (wraps.has(e.id)) {
          wrap(e, was, to, wraps.get(e.id)!);
          starts.set(e.id, { x: 0, y: 0 });
          continue;
        }
        if (typing && e.kind === "word") {
          if (withTyped(e)) {
            unclip(e);
            e.x.jump(0);
            e.y.jump(0);
          } else if (e.clip) {
            // Still sliding in from a wrap: keep its clip on the column as the line shifts.
            e.clip = {
              left: left - to.left,
              right: right - to.left,
              width: to.width,
            };
          }
          if (!crossed(was, to) || withTyped(e)) {
            starts.set(e.id, { x: e.x.get(), y: e.y.get() });
            continue;
          }
        }
        // Left edges stay put as a blank changes width; a scaled flight lines up by its middle.
        const scaled = e.s.get() !== 1;
        const dx =
          (scaled ? middle(was.box).x - middle(to).x : was.box.left - to.left) -
          carried.x;
        const dy = middle(was.box).y - middle(to).y - carried.y;
        starts.set(e.id, { x: dx, y: dy });
        glide(e, dx, dy);
        continue;
      }
      const partner =
        e.partner && departed.has(e.partner)
          ? s.seen.get(e.partner)
          : undefined;
      if (partner) {
        flown.add(e.partner!);
        fly(e, partner, to, carried);
        continue;
      }
      if (e.enter === "rise") risers.push(e);
      else if (e.enter === "fade") fadeIn(e, typing ? 0 : TIMING.settle);
    }
    risers.forEach(rise);

    for (const [id, e] of departed) {
      const was = s.seen.get(id);
      if (was && !flown.has(id)) {
        // An answer that became words keeps only its underline, retracting under them.
        if (splits.has(id)) {
          if (e.el.querySelector("[data-underline]"))
            ghost(e, was, "underline");
        } else if (e.exit !== "none") ghost(e, was, e.exit);
      }
      e.dispose();
    }
    departed.clear();
    for (const e of list) paint(e);
    glow(s.mode);
  }

  function aim(g: Glow, target: Box | null, mode: Mode | false) {
    const previous = g.target;
    if (
      target &&
      previous &&
      Math.abs(target.left - previous.left) < 0.5 &&
      Math.abs(target.top - previous.top) < 0.5 &&
      Math.abs(target.width - previous.width) < 0.5 &&
      Math.abs(target.height - previous.height) < 0.5
    ) {
      return;
    }
    g.target = target;
    if (!target) {
      animate(g.o, 0, TIMING.fade);
      return;
    }
    const shown = previous !== null && g.o.get() > 0.05;
    const values = [
      [g.x, target.left],
      [g.y, target.top],
      [g.w, target.width],
      [g.h, target.height],
    ] as const;
    if (!shown || mode === false || reduced) {
      for (const [mv, to] of values) mv.jump(to);
      if (g.o.get() < 1) animate(g.o, 1, TIMING.fade);
      return;
    }
    // Typing moves the highlight with the text, not after it.
    const along = mode === "type";
    for (const [mv, to] of values) {
      if (along) mv.jump(to);
      else animate(mv, to, spring);
    }
    animate(g.o, 1, TIMING.fade);
  }

  /** Points the highlight at the active blank: one box per line it's on. */
  function glow(mode: Mode | false) {
    if (!layer || !glows.length) return;
    const at = layer.getBoundingClientRect();
    const em = fontOf(layer);
    const boxes = active
      ? [...entries.values()]
          .filter((e) => e.el.dataset.part === active)
          .map((e) => laidOut(e, at))
          .sort((a, b) => a.top - b.top || a.left - b.left)
      : [];
    const lines: Box[] = [];
    for (const box of boxes) {
      const line = lines[lines.length - 1];
      if (line && Math.abs(middle(line).y - middle(box).y) < box.height / 2) {
        const right = Math.max(line.left + line.width, box.left + box.width);
        const bottom = Math.max(line.top + line.height, box.top + box.height);
        line.left = Math.min(line.left, box.left);
        line.top = Math.min(line.top, box.top);
        line.width = right - line.left;
        line.height = bottom - line.top;
      } else lines.push({ ...box });
    }
    const padX = SENTENCE.glow.x * em;
    const padY = SENTENCE.glow.y * em;
    glows.forEach((g, i) => {
      const line = lines[i];
      aim(
        g,
        line
          ? {
              left: line.left - padX,
              top: line.top - padY,
              width: line.width + padX * 2,
              height: line.height + padY * 2,
            }
          : null,
        mode,
      );
    });
  }

  /** Layout changed on its own (a resize, a font that loaded late): everything takes its new place. */
  function settle() {
    for (const e of entries.values()) {
      e.x.jump(0);
      e.y.jump(0);
      e.s.jump(1);
      e.el.style.zIndex = "";
      unclip(e);
    }
    glow(false);
  }

  function connect(
    form: HTMLElement,
    sentence: HTMLElement,
    overlay: HTMLElement,
  ) {
    root = form;
    layer = overlay;
    glows = [...overlay.querySelectorAll<HTMLElement>("[data-glow]")].map(
      (el) => {
        const g: Glow = {
          el,
          x: motionValue(0),
          y: motionValue(0),
          w: motionValue(0),
          h: motionValue(0),
          o: motionValue(0),
          target: null,
          dispose: () => {},
        };
        const draw = () => {
          el.style.transform = `translate(${g.x.get()}px, ${g.y.get()}px)`;
          el.style.width = `${g.w.get()}px`;
          el.style.height = `${g.h.get()}px`;
          el.style.opacity = String(g.o.get());
        };
        const off = [g.x, g.y, g.w, g.h, g.o].map((mv) =>
          mv.on("change", draw),
        );
        g.dispose = () => off.forEach((stop) => stop());
        return g;
      },
    );
    let width = sentence.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const next = sentence.getBoundingClientRect().width;
      if (Math.abs(next - width) < 0.5) return;
      width = next;
      settle();
    });
    observer.observe(sentence);
    const fonts = document.fonts;
    fonts?.addEventListener?.("loadingdone", settle);
    return () => {
      observer.disconnect();
      fonts?.removeEventListener?.("loadingdone", settle);
      glows.forEach((g) => g.dispose());
      glows = [];
      root = null;
      layer = null;
    };
  }

  function shake(name: string) {
    if (reduced) return;
    for (const e of entries.values()) {
      if (e.el.dataset.part === name)
        animate(e.x, [...SENTENCE.shake], TIMING.shake);
    }
  }

  return {
    attach,
    configure,
    snapshot,
    commit,
    connect,
    shake,
    setReduced: (value: boolean) => {
      reduced = value;
    },
    setSpring: (value: Spring) => {
      spring = value;
    },
  };
}

type Engine = ReturnType<typeof createEngine>;

const EngineContext = React.createContext<Engine | null>(null);

type PieceProps = Partial<PieceOptions> &
  React.HTMLAttributes<HTMLElement> & {
    id: string;
    /** The field this is a visible part of; the highlight wraps a field's parts. */
    part?: string;
    as?: "span" | "div";
  };

/** One element the engine moves. Words, answers and option labels are inline blocks. */
function Piece({
  id,
  part,
  kind = "word",
  partner,
  origin,
  enter = "none",
  exit = "none",
  as = "span",
  className,
  ...props
}: PieceProps) {
  const engine = React.useContext(EngineContext);
  const ref = React.useRef<HTMLElement>(null);
  React.useLayoutEffect(() => {
    if (engine && ref.current) return engine.attach(id, ref.current);
  }, [engine, id]);
  React.useLayoutEffect(() => {
    engine?.configure(id, { kind, partner, origin, enter, exit });
  });
  const shared = {
    ...props,
    "data-piece": id,
    "data-part": part,
    className: cn("relative", kind !== "block" && "inline-block", className),
  };
  return as === "div" ? (
    <div ref={ref as React.Ref<HTMLDivElement>} {...shared} />
  ) : (
    <span ref={ref as React.Ref<HTMLSpanElement>} {...shared} />
  );
}

/* ── Form state shared with the blanks and the tray ─────── */

type Ids = { options: string; label: string; hint: string; error: string };

type Api = {
  locale: string;
  status: Status;
  editable: boolean;
  reduced: boolean;
  spring: Spring;
  active: string | null;
  keys: boolean;
  errors: Record<string, FieldError>;
  ids: (name: string) => Ids;
  valueOf: (name: string) => string | string[];
  typing: (field: Field) => boolean;
  upNext: (name: string) => string | undefined;
  describedBy: (field: Field) => string | undefined;
  choice: (field: Field) => React.HTMLAttributes<HTMLElement>;
  text: (field: Field) => React.InputHTMLAttributes<HTMLInputElement>;
  pick: (field: Field, value: string) => void;
  other: (field: Field) => void;
  optionsKeyDown: (
    field: Field,
    event: React.KeyboardEvent<HTMLElement>,
  ) => void;
};

const FormContext = React.createContext<Api | null>(null);

function useForm() {
  const form = React.useContext(FormContext);
  if (!form)
    throw new Error("This part must be rendered inside <SentenceForm>.");
  return form;
}

const hintFor = (field: Field) =>
  field.hint ??
  (field.options
    ? field.multiple
      ? "Pick any"
      : field.custom
        ? "Pick one, or write your own"
        : "Pick one"
    : null);

const otherLabel = (field: Field) =>
  typeof field.custom === "string" ? field.custom : "Other";

/* ── SentenceForm ───────────────────────────────────────── */

type Focus =
  { blank: string; shake?: boolean } | { options: string } | { success: true };

export interface SentenceFormProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "children"
> {
  /**
   * The sentence, with `SentenceFormField`s as its blanks. Or a function of
   * the current values, for clauses that depend on an answer.
   */
  children: React.ReactNode | ((values: SentenceFormValues) => React.ReactNode);
  /**
   * Called on send with the values of the blanks in the sentence and the
   * form's FormData. Return a promise to hold the form in a pending state;
   * if it rejects, `errorMessage` shows and nothing is lost.
   */
  onSubmit?: (
    values: SentenceFormValues,
    formData: FormData,
  ) => void | PromiseLike<unknown>;
  /** The confirmation that rises where the button was, or a function of what was sent. */
  success?:
    | React.ReactNode
    | ((sent: {
        values: SentenceFormValues;
        edit: () => void;
        reset: () => void;
      }) => React.ReactNode);
  /** Shown, and announced, when `onSubmit` throws or its promise rejects. */
  errorMessage?: React.ReactNode;
  /** The send button's label. */
  submitLabel?: React.ReactNode;
  /** The values, to control the form from outside. Pair with `onValuesChange`. */
  values?: SentenceFormValues;
  /** The values it starts with. A field's own `defaultValue` fills in the rest. */
  defaultValues?: SentenceFormValues;
  /** Called with every value whenever one changes. */
  onValuesChange?: (values: SentenceFormValues) => void;
  /** Locale for joining picks ("a, b, and c"). Set explicitly so the server and browser agree. */
  locale?: string;
  /** Classes for the tray under the sentence. */
  trayClassName?: string;
  /** Classes for the send button. It has `data-ready="true"` once the required blanks are filled. */
  submitClassName?: string;
  /** Seconds a picked option takes to fly into its blank, and the words around it to make room. */
  duration?: number;
  /** How much the flights and the reflow overshoot and settle, from 0 (none) up. */
  bounce?: number;
}

/**
 * A form written as a sentence. Each blank is a real field set inline at the
 * sentence's own size; picked options fly up into their blanks while the
 * words after them glide aside, and on send the form settles into the
 * sentence that was written.
 */
export function SentenceForm({
  children,
  onSubmit,
  success,
  errorMessage = "That didn't go through. Everything you wrote is still here, so try again.",
  submitLabel = "Send",
  values,
  defaultValues,
  onValuesChange,
  locale = "en-US",
  className,
  trayClassName,
  submitClassName,
  duration = TIMING.flow.visualDuration,
  bounce = TIMING.flow.bounce,
  onBlur,
  ...props
}: SentenceFormProps) {
  const uid = React.useId();
  const reduced = useReducedMotion() ?? false;
  const spring = React.useMemo<Spring>(
    () => ({ type: "spring", visualDuration: duration, bounce }),
    [duration, bounce],
  );
  // Focus moves on about when a pick-one choice's flight lands, so the beat follows the duration.
  const beatMs = TIMING.beat * (duration / TIMING.flow.visualDuration);
  const [engine] = React.useState(createEngine);
  const [own, setOwn] = React.useState<SentenceFormValues>(
    () => defaultValues ?? {},
  );
  const [active, setActive] = React.useState<string | null>(null);
  const [custom, setCustom] = React.useState<Record<string, boolean>>({});
  const [errors, setErrors] = React.useState<Record<string, FieldError>>({});
  const [status, setStatus] = React.useState<Status>("editing");
  const [sent, setSent] = React.useState<SentenceFormValues>({});
  const [keys, setKeys] = React.useState(false);
  const [news, setNews] = React.useState<{ id: number; text: React.ReactNode }>(
    { id: 0, text: null },
  );
  const [restarts, setRestarts] = React.useState(0);

  const formRef = React.useRef<HTMLFormElement>(null);
  const sentenceRef = React.useRef<HTMLDivElement>(null);
  const layerRef = React.useRef<HTMLSpanElement>(null);
  const submitRef = React.useRef<HTMLButtonElement>(null);
  const successRef = React.useRef<HTMLDivElement>(null);
  const focusNext = React.useRef<Focus | null>(null);
  const beat = React.useRef(0);
  const ticket = React.useRef(0);
  const modality = React.useRef<"keys" | "pointer">("pointer");

  /* The sentence, read with the current values. */
  const raw = values ?? own;
  const read = (source: SentenceFormValues) =>
    typeof children === "function" ? children(source) : children;
  let parsed = parse(read(raw));
  let current = raw;
  for (const field of parsed.fields) {
    if (field.defaultValue !== undefined && current[field.name] === undefined) {
      current = { ...current, [field.name]: field.defaultValue };
    }
  }
  if (current !== raw && typeof children === "function")
    parsed = parse(read(current));
  const { flow, fields } = parsed;
  const byName = new Map(fields.map((field) => [field.name, field]));

  const valueOf = (name: string): string | string[] => {
    const value = current[name];
    if (byName.get(name)?.multiple)
      return Array.isArray(value) ? value : value ? [value] : [];
    return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
  };
  /** Whether a blank with options is showing its "Other" text input. */
  const typing = (field: Field) => {
    if (!field.options) return true;
    if (!field.custom || field.multiple) return false;
    const value = valueOf(field.name) as string;
    return (
      !!custom[field.name] ||
      (!!value && !field.options.some((option) => option.value === value))
    );
  };

  const editable = status === "editing" || status === "failed";
  const ready = fields.every(
    (field) => !field.required || !isEmpty(valueOf(field.name)),
  );

  const latest = React.useRef({ fields, valueOf, active });
  React.useLayoutEffect(() => {
    latest.current = { fields, valueOf, active };
  });

  const ids = (name: string): Ids => {
    const base = `${uid}-${name.replace(/[^\w-]/g, "_")}`;
    return {
      options: `${base}-options`,
      label: `${base}-label`,
      hint: `${base}-hint`,
      error: `${base}-error`,
    };
  };
  const blankOf = (name: string) =>
    formRef.current?.querySelector<HTMLElement>(
      `[data-blank="${CSS.escape(name)}"]`,
    ) ?? null;
  const trayOf = () =>
    formRef.current?.querySelector<HTMLElement>("[data-tray]") ?? null;
  const say = (text: React.ReactNode) =>
    setNews((n) => ({ id: n.id + 1, text }));

  /* Moving between blanks. */

  const open = (name: string | null) => {
    if (name === active) return;
    engine.snapshot("flow");
    setActive(name);
    if (name) setKeys(modality.current === "keys");
  };

  const focusOptions = (name: string) => {
    const list = document.getElementById(ids(name).options);
    const target =
      list?.querySelector<HTMLElement>('[aria-selected="true"]') ??
      list?.querySelector<HTMLElement>('[role="option"]');
    target?.focus();
  };

  const intoOptions = (name: string) => {
    setKeys(true);
    if (active === name) focusOptions(name);
    else {
      open(name);
      focusNext.current = { options: name };
    }
  };

  const upNext = (from: string) => nextEmpty(from, fields, valueOf);

  const advance = (from: string, sendIfDone: boolean) => {
    const next = nextEmpty(from, latest.current.fields, latest.current.valueOf);
    if (next) blankOf(next)?.focus();
    else if (sendIfDone) formRef.current?.requestSubmit(submitRef.current);
    else submitRef.current?.focus();
  };

  /** Tab out of a tray: the blank after its own, or the send button. */
  const after = (name: string) => {
    const i = fields.findIndex((field) => field.name === name);
    const next = fields[i + 1];
    if (next) blankOf(next.name)?.focus();
    else submitRef.current?.focus();
  };

  /* Changing values. */

  const write = (
    name: string,
    next: string | string[],
    mode: Mode = "flow",
  ) => {
    engine.snapshot(mode, name);
    const all = { ...current, [name]: next };
    if (values === undefined) setOwn(all);
    onValuesChange?.(all);
    const error = errors[name];
    const field = byName.get(name);
    if (error && field) {
      const fixed =
        error.kind === "required"
          ? !isEmpty(next)
          : isEmpty(next) || !check(field, next, typing(field));
      if (fixed)
        setErrors((all) =>
          Object.fromEntries(
            Object.entries(all).filter(([key]) => key !== name),
          ),
        );
    }
    if (status === "failed") setStatus("editing");
  };

  const pick = (field: Field, value: string) => {
    if (!editable) return;
    window.clearTimeout(beat.current);
    const now = valueOf(field.name);
    if (field.multiple) {
      const picks = now as string[];
      write(
        field.name,
        picks.includes(value)
          ? picks.filter((v) => v !== value)
          : [...picks, value],
      );
      return;
    }
    const wasTyping = typing(field);
    if (wasTyping) {
      // The text input goes away, so focus moves to the blank it turns back into.
      setCustom((all) => ({ ...all, [field.name]: false }));
      focusNext.current = { blank: field.name };
    }
    if (now === value && !wasTyping) {
      write(field.name, ""); // the outline was tapped: send the pick back down
      return;
    }
    write(field.name, value);
    beat.current = window.setTimeout(() => {
      if (latest.current.active === field.name) advance(field.name, false);
    }, beatMs);
  };

  const other = (field: Field) => {
    if (!editable) return;
    window.clearTimeout(beat.current);
    if (typing(field)) {
      blankOf(field.name)?.focus();
      return;
    }
    engine.snapshot("flow");
    setCustom((all) => ({ ...all, [field.name]: true }));
    if (valueOf(field.name)) write(field.name, ""); // the old pick drops back into the tray
    focusNext.current = { blank: field.name };
  };

  const closeCustom = (field: Field, refocus: boolean) => {
    engine.snapshot("flow");
    setCustom((all) => ({ ...all, [field.name]: false }));
    if (refocus) focusNext.current = { blank: field.name };
  };

  /* Event handlers for the blanks and the tray. */

  const choice = (field: Field): React.HTMLAttributes<HTMLElement> => ({
    onFocus: () => {
      if (editable) open(field.name);
    },
    // Focus is moved by hand on click, so a click never blurs the blank you're
    // leaving before the new one opens (Safari doesn't focus buttons on click).
    onMouseDown: (event) => {
      if (event.button === 0) event.preventDefault();
    },
    onClick: (event) => {
      if (!editable || event.detail === 0) return;
      // Focusing opens it; clicking it again keeps it open (Esc or a click elsewhere closes).
      if (document.activeElement !== event.currentTarget)
        event.currentTarget.focus();
      else open(field.name);
    },
    onKeyDown: (event) => {
      if (!editable) return;
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        intoOptions(field.name);
      } else if (event.key === "Escape" && active === field.name) {
        event.preventDefault();
        open(null);
      }
    },
  });

  const text = (field: Field): React.InputHTMLAttributes<HTMLInputElement> => {
    const isCustom = !!field.options;
    return {
      onFocus: () => {
        if (editable) open(field.name);
      },
      onChange: (event) => write(field.name, event.target.value, "type"),
      onKeyDown: (event) => {
        if (!editable) return;
        if (event.key === "Enter" && !event.nativeEvent.isComposing) {
          event.preventDefault();
          advance(field.name, true);
        } else if (event.key === "ArrowDown" && isCustom) {
          event.preventDefault();
          intoOptions(field.name);
        } else if (event.key === "Escape") {
          if (isCustom && isEmpty(valueOf(field.name))) {
            event.preventDefault();
            closeCustom(field, true);
          } else if (active === field.name) {
            event.preventDefault();
            open(null);
          }
        }
      },
      onBlur: (event) => {
        if (
          !isCustom ||
          !isEmpty(valueOf(field.name)) ||
          !event.target.isConnected
        )
          return;
        if (
          event.relatedTarget &&
          trayOf()?.contains(event.relatedTarget as Node)
        )
          return;
        closeCustom(field, false);
      },
    };
  };

  const optionsKeyDown = (
    field: Field,
    event: React.KeyboardEvent<HTMLElement>,
  ) => {
    const items = [
      ...event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'),
    ];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (j: number) => {
      event.preventDefault();
      items[Math.max(0, Math.min(items.length - 1, j))]?.focus();
    };
    const toBlank = () => {
      event.preventDefault();
      blankOf(field.name)?.focus();
    };
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        return go(i + 1);
      case "ArrowLeft":
      case "ArrowUp":
        return i <= 0 ? toBlank() : go(i - 1);
      case "Home":
        return go(0);
      case "End":
        return go(items.length - 1);
      case "Escape":
        return toBlank();
      case "Tab":
        if (event.shiftKey) return toBlank();
        event.preventDefault();
        return after(field.name);
      case " ":
      case "Enter": {
        event.preventDefault();
        const option = items[i];
        if (!option) return;
        const value = option.dataset.option;
        if (field.multiple && event.key === "Enter") {
          // Enter finishes a pick-any blank, picking the focused option if nothing is picked yet.
          if (value !== undefined && isEmpty(valueOf(field.name))) {
            pick(field, value);
            beat.current = window.setTimeout(
              () => advance(field.name, false),
              beatMs,
            );
          } else advance(field.name, false);
          return;
        }
        if (value === undefined) other(field);
        else pick(field, value);
      }
    }
  };

  const describedBy = (field: Field) => {
    if (active !== field.name) return undefined;
    const { hint, error } = ids(field.name);
    return (
      [hintFor(field) ? hint : null, errors[field.name] ? error : null]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  /* Sending. */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editable) return;
    window.clearTimeout(beat.current);
    const problems = fields.flatMap((field) => {
      const problem = check(field, valueOf(field.name), typing(field));
      return problem ? [{ field, problem }] : [];
    });
    if (problems.length) {
      engine.snapshot("flow");
      setErrors(
        Object.fromEntries(
          problems.map(({ field, problem }) => [field.name, problem]),
        ),
      );
      if (status === "failed") setStatus("editing");
      const [{ field, problem }] = problems;
      focusNext.current = { blank: field.name, shake: true };
      say(`${field.label}: ${problem.message}`);
      return;
    }

    // Read the form before anything is locked: disabled fields drop out of FormData.
    const data = new FormData(event.currentTarget);
    const submitted = Object.fromEntries(
      fields.map((field) => [field.name, valueOf(field.name)]),
    );
    const mine = ++ticket.current;
    const done = () => {
      if (mine !== ticket.current) return;
      engine.snapshot("flow");
      setSent(submitted);
      setErrors({});
      say(null); // the confirmation takes focus and speaks for itself
      setActive(null);
      setStatus("sent");
      focusNext.current = { success: true };
    };
    const fail = () => {
      if (mine !== ticket.current) return;
      setStatus("failed");
      say(errorMessage);
    };
    let result: void | PromiseLike<unknown>;
    try {
      result = onSubmit?.(submitted, data);
    } catch {
      fail();
      return;
    }
    if (result && typeof result.then === "function") {
      submitRef.current?.focus(); // the blanks lock while it sends
      engine.snapshot("flow");
      setActive(null);
      setStatus("pending");
      result.then(done, fail);
    } else done();
  };

  // Both reopen the sentence and focus its first blank (see the effect below).
  const edit = () => {
    engine.snapshot("flow");
    setStatus("editing");
    setRestarts((n) => n + 1);
  };

  const reset = () => {
    engine.snapshot("flow");
    const start = defaultValues ?? {};
    if (values === undefined) setOwn(start);
    onValuesChange?.(start);
    setCustom({});
    setErrors({});
    setStatus("editing");
    setRestarts((n) => n + 1);
  };

  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    onBlur?.(event);
    if (!event.target.isConnected) return; // its blank was swapped for another, which takes focus
    const to = event.relatedTarget;
    if (to && (sentenceRef.current?.contains(to) || trayOf()?.contains(to)))
      return;
    if (active) open(null);
  };

  /* Effects. */

  React.useLayoutEffect(
    () =>
      engine.connect(formRef.current!, sentenceRef.current!, layerRef.current!),
    [engine],
  );
  React.useLayoutEffect(() => engine.setReduced(reduced), [engine, reduced]);
  React.useLayoutEffect(() => engine.setSpring(spring), [engine, spring]);

  React.useLayoutEffect(() => {
    engine.commit(editable ? active : null);
    const next = focusNext.current;
    if (!next) return;
    focusNext.current = null;
    if ("success" in next) successRef.current?.focus();
    else if ("options" in next) focusOptions(next.options);
    else {
      blankOf(next.blank)?.focus();
      if (next.shake) requestAnimationFrame(() => engine.shake(next.blank));
    }
  });

  React.useLayoutEffect(() => {
    if (restarts)
      formRef.current?.querySelector<HTMLElement>("[data-blank]")?.focus();
  }, [restarts]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (/^(Tab|Enter| |Arrow)/.test(event.key)) modality.current = "keys";
    };
    const onPointer = () => {
      modality.current = "pointer";
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onPointer, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onPointer, true);
      window.clearTimeout(beat.current);
    };
  }, []);

  // On a phone, keep the active blank and its tray above the keyboard.
  React.useEffect(() => {
    const form = formRef.current;
    if (!active || !form) return;
    const view = window.visualViewport;
    const keep = () => {
      const blank = form.querySelector(`[data-blank="${CSS.escape(active)}"]`);
      const tray = form.querySelector("[data-tray]");
      if (!blank || !tray) return;
      const top = view ? view.offsetTop : 0;
      const bottom = top + (view ? view.height : window.innerHeight);
      const over = tray.getBoundingClientRect().bottom + 16 - bottom;
      const room = blank.getBoundingClientRect().top - top - 16;
      if (over > 0 && room > 0) window.scrollBy({ top: Math.min(over, room) });
    };
    const frame = requestAnimationFrame(keep);
    view?.addEventListener("resize", keep);
    return () => {
      cancelAnimationFrame(frame);
      view?.removeEventListener("resize", keep);
    };
  }, [active]);

  /* Rendering. */

  const settled = status === "sent";
  const spoken = (field: Field) => {
    const value = valueOf(field.name);
    if (isEmpty(value)) return "";
    if (Array.isArray(value))
      return listFormat(locale).format(value.map((v) => labelOf(field, v)));
    return typing(field) ? value : labelOf(field, value);
  };
  const { before, after: lastWords } = speech(
    flow,
    settled ? spoken : () => null,
  );

  const api: Api = {
    locale,
    status,
    editable,
    reduced,
    spring,
    active,
    keys,
    errors,
    ids,
    valueOf,
    typing,
    upNext,
    describedBy,
    choice,
    text,
    pick,
    other,
    optionsKeyDown,
  };

  const activeField = editable && active ? byName.get(active) : undefined;
  const pending = status === "pending";
  const confirmation =
    typeof success === "function"
      ? success({ values: sent, edit, reset })
      : (success ?? "Sent. Thank you!");

  return (
    <EngineContext.Provider value={engine}>
      <FormContext.Provider value={api}>
        <form
          {...props}
          ref={formRef}
          noValidate
          aria-busy={pending || undefined}
          onSubmit={handleSubmit}
          onBlur={handleBlur}
          className={cn(
            "relative isolate [--sentence-error:color-mix(in_oklab,#e5484d_78%,currentColor)]",
            className,
          )}
        >
          <div ref={sentenceRef} className="relative">
            <span
              ref={layerRef}
              aria-hidden
              className="pointer-events-none absolute inset-0"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  data-glow=""
                  className="absolute top-0 left-0 rounded-[0.2em] bg-current/[0.07] opacity-0"
                />
              ))}
            </span>
            {group(flow).map((unit, i) => (
              <React.Fragment key={unit.key}>
                {i > 0 ? " " : null}
                {unit.atoms.map((atom) =>
                  before.get(atom.id) ? (
                    <span key={`said-${atom.id}`} className="sr-only">
                      {before.get(atom.id)}
                    </span>
                  ) : null,
                )}
                <Unit atoms={unit.atoms} />
              </React.Fragment>
            ))}
            {lastWords ? <span className="sr-only">{lastWords}</span> : null}
          </div>

          <Piece
            id="tray"
            kind="block"
            as="div"
            data-tray=""
            className={cn("mt-7", trayClassName)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {activeField ? (
                <Tray key={activeField.name} field={activeField} />
              ) : null}
            </AnimatePresence>
          </Piece>

          <Piece
            id="actions"
            kind="block"
            as="div"
            className="mt-7 font-sans text-[15px]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {settled ? (
                <motion.div
                  key="sent"
                  ref={successRef}
                  tabIndex={-1}
                  className="outline-none"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { ...spring, delay: TIMING.actionsDelay },
                  }}
                  exit={{
                    opacity: 0,
                    y: reduced ? 0 : 6,
                    transition: TIMING.leave,
                  }}
                >
                  {confirmation}
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  className="flex flex-wrap items-center gap-x-4 gap-y-2"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { ...spring, delay: TIMING.actionsDelay },
                  }}
                  exit={{
                    opacity: 0,
                    y: reduced ? 0 : -8,
                    transition: TIMING.leave,
                  }}
                >
                  <button
                    ref={submitRef}
                    type="submit"
                    // Keep focus in the blank until the click lands: blurring it
                    // first folds its tray, the button jumps up, and the click
                    // misses (the first click on Send did nothing).
                    onMouseDown={(event) => {
                      if (event.button === 0) event.preventDefault();
                    }}
                    data-ready={ready}
                    aria-disabled={pending || undefined}
                    className={cn(
                      "group/send inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 font-medium ring-1 ring-current/25 outline-none select-none ring-inset",
                      `transition-[background-color,color,box-shadow,scale] ${TIMING.press} hover:ring-current/50 active:scale-[0.97] motion-reduce:active:scale-100`,
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                      "data-[ready=true]:bg-neutral-darkest data-[ready=true]:text-white data-[ready=true]:ring-transparent",
                      "aria-disabled:cursor-progress",
                      submitClassName,
                    )}
                  >
                    {submitLabel}
                    {pending ? (
                      <span
                        aria-hidden
                        className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
                      />
                    ) : (
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        className={`size-3.5 transition-transform ${TIMING.nudge} group-hover/send:translate-x-0.5`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    )}
                    {pending ? (
                      <span className="sr-only">, sending</span>
                    ) : null}
                  </button>
                  <AnimatePresence initial={false}>
                    {status === "failed" ? (
                      <motion.p
                        className="text-(--sentence-error)"
                        initial={
                          reduced ? { opacity: 0 } : { opacity: 0, x: -6 }
                        }
                        animate={{ opacity: 1, x: 0, transition: spring }}
                        exit={{ opacity: 0, transition: TIMING.leave }}
                      >
                        {errorMessage}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </Piece>

          <span role="status" className="sr-only">
            <span key={news.id}>{news.text}</span>
          </span>
        </form>
      </FormContext.Provider>
    </EngineContext.Provider>
  );
}

/* ── The sentence's pieces ──────────────────────────────── */

/** Words and elements, each its own piece. */
function Glue({ atoms }: { atoms: Atom[] }) {
  return atoms.map((atom) =>
    atom.kind === "field" ? null : (
      <Piece
        key={atom.id}
        id={atom.id}
        aria-hidden={atom.kind === "text" || undefined}
        enter="rise"
        exit="fold"
      >
        {atom.kind === "text" ? atom.text : atom.node}
      </Piece>
    ),
  );
}

/** A run with no spaces in it: words glued together, or a blank with the punctuation that touches it. */
function Unit({ atoms }: { atoms: Atom[] }) {
  const blanks: BlankProps[] = [];
  const lead: Atom[] = [];
  for (const atom of atoms) {
    if (atom.kind === "field")
      blanks.push({
        field: atom.field,
        prefix: blanks.length ? [] : lead,
        suffix: [],
      });
    else if (blanks.length) blanks[blanks.length - 1].suffix.push(atom);
    else lead.push(atom);
  }
  if (!blanks.length) {
    return atoms.length > 1 ? (
      <span className="whitespace-nowrap">
        <Glue atoms={atoms} />
      </span>
    ) : (
      <Glue atoms={atoms} />
    );
  }
  return blanks.map((blank) => <Blank key={blank.field.name} {...blank} />);
}

type BlankProps = { field: Field; prefix: Atom[]; suffix: Atom[] };

function Blank(props: BlankProps) {
  const form = useForm();
  const { field } = props;
  if (form.status === "sent") return <SettledBlank {...props} />;
  if (form.typing(field)) return <TextBlank {...props} />;
  return field.multiple ? <ManyBlank {...props} /> : <OneBlank {...props} />;
}

function Underline({
  filled,
  active,
  invalid,
}: {
  filled: boolean;
  active: boolean;
  invalid: boolean;
}) {
  return (
    <span
      aria-hidden
      data-underline=""
      className={cn(
        `pointer-events-none absolute inset-x-0 bottom-[0.04em] origin-left border-b-[max(1.5px,0.05em)] transition-[border-color,border-bottom-width] ${TIMING.underlineStyle}`,
        filled ? "border-solid" : "border-dotted",
        invalid
          ? "border-(--sentence-error)"
          : active
            ? "border-current/80"
            : filled
              ? "border-current/25"
              : "border-current/40",
        active && "border-b-[max(2.5px,0.085em)]",
      )}
    />
  );
}

/** One answer, or the placeholder, sitting on its underline. */
function Answer({
  id,
  field,
  partner,
  origin,
  muted,
  children,
}: {
  id: string;
  field: Field;
  partner?: string;
  origin?: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  const form = useForm();
  return (
    <Piece
      id={id}
      part={field.name}
      partner={partner}
      origin={origin}
      enter="fade"
      exit="fade"
      className={cn(
        "whitespace-nowrap",
        muted && "text-current/45",
        field.className,
      )}
    >
      {children}
      <Underline
        filled={!muted}
        active={form.active === field.name}
        invalid={!!form.errors[field.name]}
      />
    </Piece>
  );
}

const INPUT =
  "col-start-1 row-start-1 m-0 w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-inherit outline-none placeholder:text-current/45 read-only:cursor-default " +
  // Keep the browser's autofill tint (and its forced text color) from boxing in the blank.
  "[&:-webkit-autofill]:[transition:background-color_0s_600000s,color_0s_600000s] [&:autofill]:[transition:background-color_0s_600000s,color_0s_600000s]";

function TextBlank({ field, prefix, suffix }: BlankProps) {
  const form = useForm();
  const { name } = field;
  const value = form.valueOf(name) as string;
  const custom = !!field.options;
  const id = custom ? `f:${name}:custom` : `f:${name}:input`;
  const error = form.errors[name];
  return (
    <span data-unit="" className="whitespace-nowrap">
      <Glue atoms={prefix} />
      <Piece
        key={id}
        id={id}
        part={name}
        origin={value ? `${id}~0` : undefined}
        enter={custom ? "fade" : "rise"}
        exit={custom ? "fade" : "fold"}
        className={cn(
          "inline-grid max-w-full grid-cols-[minmax(0,auto)] align-baseline",
          suffix.length > 0 && "max-w-[calc(100%-0.6em)]",
          field.className,
        )}
      >
        {/* Hidden copies set the width and the input fills it. While the blank is
            active it keeps at least its placeholder's room, so the first letters
            typed don't pull the rest of the sentence back. */}
        <span
          aria-hidden
          className="invisible col-start-1 row-start-1 overflow-hidden pr-[0.08em] whitespace-pre"
        >
          {value || field.placeholder || "\u00a0".repeat(6)}
        </span>
        {value && form.active === name && field.placeholder ? (
          <span
            aria-hidden
            className="invisible col-start-1 row-start-1 overflow-hidden whitespace-pre"
          >
            {field.placeholder}
          </span>
        ) : null}
        <input
          data-blank={name}
          name={name}
          type={field.type ?? "text"}
          value={value}
          size={1}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          spellCheck={
            field.type === "email" || field.type === "url" ? false : undefined
          }
          enterKeyHint={form.upNext(name) ? "next" : "send"}
          aria-label={field.label}
          aria-required={field.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={form.describedBy(field)}
          readOnly={!form.editable}
          className={INPUT}
          {...form.text(field)}
        />
        <Underline
          filled={!!value}
          active={form.active === name}
          invalid={!!error}
        />
      </Piece>
      <Glue atoms={suffix} />
    </span>
  );
}

function OneBlank({ field, prefix, suffix }: BlankProps) {
  const form = useForm();
  const { name } = field;
  const value = form.valueOf(name) as string;
  const open = form.active === name;
  const label = value ? labelOf(field, value) : null;
  const id = value ? `f:${name}:v:${value}` : `f:${name}:ph`;
  return (
    <span className="whitespace-nowrap">
      <Glue atoms={prefix} />
      <button
        type="button"
        data-blank={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? form.ids(name).options : undefined}
        aria-label={label ? `${field.label}, ${label}` : field.label}
        aria-describedby={form.describedBy(field)}
        aria-disabled={!form.editable || undefined}
        className="cursor-pointer align-baseline outline-none aria-disabled:cursor-default"
        {...form.choice(field)}
      >
        <Answer
          key={id}
          id={id}
          field={field}
          partner={value ? `c:${name}:${value}` : undefined}
          origin={value ? `${id}~0` : undefined}
          muted={!value}
        >
          {label ?? field.placeholder ?? "\u00a0".repeat(6)}
        </Answer>
      </button>
      <input type="hidden" name={name} value={value} />
      <Glue atoms={suffix} />
    </span>
  );
}

/** A pick-any blank: its picks as separate words joined with list grammar, so the list can wrap. */
function ManyBlank({ field, prefix, suffix }: BlankProps) {
  const form = useForm();
  const { name } = field;
  const picks = form.valueOf(name) as string[];
  const open = form.active === name;
  const bits: (ListBit | null)[] = picks.length
    ? listBits(field, picks, form.locale)
    : [
        {
          kind: "word",
          id: `f:${name}:ph`,
          text: field.placeholder ?? "\u00a0".repeat(6),
        },
      ];
  const units = group(bits);
  const label = picks.length
    ? `${field.label}, ${listFormat(form.locale).format(picks.map((value) => labelOf(field, value)))}`
    : field.label;
  return (
    <span
      role="button"
      tabIndex={form.editable ? 0 : -1}
      data-blank={name}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? form.ids(name).options : undefined}
      aria-label={label}
      aria-describedby={form.describedBy(field)}
      aria-disabled={!form.editable || undefined}
      className="cursor-pointer whitespace-normal outline-none aria-disabled:cursor-default"
      {...form.choice(field)}
    >
      {units.map((unit, i) => (
        <React.Fragment key={unit.key}>
          {i > 0 ? " " : null}
          <span className="whitespace-nowrap">
            {i === 0 ? <Glue atoms={prefix} /> : null}
            {unit.atoms.map((bit) =>
              bit.kind === "pick" ? (
                <Answer
                  key={bit.id}
                  id={bit.id}
                  field={field}
                  partner={`c:${name}:${bit.value}`}
                  origin={`${bit.id}~0`}
                >
                  {bit.label}
                </Answer>
              ) : picks.length ? (
                <Piece
                  key={bit.id}
                  id={bit.id}
                  aria-hidden
                  enter="fade"
                  exit="fade"
                >
                  {bit.text}
                </Piece>
              ) : (
                <Answer key={bit.id} id={bit.id} field={field} muted>
                  {bit.text}
                </Answer>
              ),
            )}
            {i === units.length - 1 ? <Glue atoms={suffix} /> : null}
          </span>
        </React.Fragment>
      ))}
      {picks.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </span>
  );
}

/** After sending: the answer as plain words that wrap like the rest of the sentence. */
function SettledBlank({ field, prefix, suffix }: BlankProps) {
  const form = useForm();
  const { name } = field;
  const value = form.valueOf(name);
  const typing = form.typing(field);
  const bits: ({
    id: string;
    text: string;
    origin?: string;
    muted?: boolean;
  } | null)[] = [];
  const words = (text: string, from: string) => {
    let k = 0;
    text.split(/(\s+)/).forEach((bit) => {
      if (!bit) return;
      if (/^\s/.test(bit)) bits.push(null);
      else bits.push({ id: `${from}~${k++}`, text: bit, origin: from });
    });
  };
  if (isEmpty(value)) {
    const from = !field.options
      ? `f:${name}:input`
      : typing
        ? `f:${name}:custom`
        : `f:${name}:ph`;
    bits.push({ id: `f:${name}:dash`, text: "—", origin: from, muted: true });
  } else if (Array.isArray(value)) {
    for (const bit of listBits(field, value, form.locale)) {
      if (bit === null) bits.push(null);
      else if (bit.kind === "pick") words(bit.label, bit.id);
      else bits.push({ id: bit.id, text: bit.text });
    }
  } else if (typing)
    words(value, field.options ? `f:${name}:custom` : `f:${name}:input`);
  else words(labelOf(field, value), `f:${name}:v:${value}`);

  const units = group(bits);
  return (
    <span>
      {units.map((unit, i) => (
        <React.Fragment key={unit.key}>
          {i > 0 ? " " : null}
          <span className="whitespace-nowrap">
            {i === 0 ? <Glue atoms={prefix} /> : null}
            {unit.atoms.map((bit) => (
              <Piece
                key={bit.id}
                id={bit.id}
                origin={bit.origin}
                aria-hidden
                enter="fade"
                exit="fade"
                // A word longer than the line (a long email) breaks rather than overflowing.
                className={cn(
                  "[overflow-wrap:anywhere] whitespace-normal",
                  bit.muted && "text-current/45",
                  field.className,
                )}
              >
                {bit.text}
              </Piece>
            ))}
            {i === units.length - 1 ? <Glue atoms={suffix} /> : null}
          </span>
        </React.Fragment>
      ))}
      {(Array.isArray(value) ? value : [value]).map((v, i) => (
        <input key={i} type="hidden" name={name} value={v} />
      ))}
    </span>
  );
}

/* ── The tray ───────────────────────────────────────────── */

const CHIP =
  "relative inline-flex h-10 cursor-pointer items-center rounded-full border px-4 text-[15px] leading-none whitespace-nowrap outline-none select-none " +
  `transition-[background-color,border-color] ${TIMING.chip} before:absolute before:-inset-1 before:content-[''] ` +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

// AnimatePresence pops a leaving tray out of the flow through this ref, so the
// tray's height changes as soon as the next blank opens.
function Tray({
  field,
  ref,
}: {
  field: Field;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const form = useForm();
  const { name } = field;
  const ids = form.ids(name);
  const value = form.valueOf(name);
  const error = form.errors[name];
  const hint = hintFor(field);
  const typing = form.typing(field);
  const keyHint = !form.keys
    ? null
    : !field.options || typing
      ? form.upNext(name)
        ? "Enter for the next blank"
        : "Enter to send"
      : field.multiple
        ? "Space picks · Enter when done"
        : "Arrows move · Enter picks";
  const options = field.options ?? [];
  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial={{ opacity: 0 }}
      // Arrives just after the last blank's tray has faded, so their words never overlap.
      animate={{
        opacity: 1,
        transition: { ...TIMING.fade, delay: TIMING.trayDelay },
      }}
      exit={{ opacity: 0, transition: TIMING.trayOut }}
    >
      <p className="flex flex-wrap items-baseline gap-x-2 font-sans text-[13px] leading-5">
        <span id={ids.label} className="font-medium">
          {field.label}
        </span>
        {hint ? (
          <span id={ids.hint} className="opacity-60">
            {hint}
          </span>
        ) : null}
        {keyHint ? (
          <span className="ml-auto opacity-45 max-sm:hidden">{keyHint}</span>
        ) : null}
      </p>
      {error ? (
        <p
          id={ids.error}
          className="mt-1 font-sans text-[13px] leading-5 text-(--sentence-error)"
        >
          {error.message}
        </p>
      ) : null}
      {field.options ? (
        <div
          id={ids.options}
          role="listbox"
          aria-labelledby={ids.label}
          aria-multiselectable={field.multiple || undefined}
          onKeyDown={(event) => form.optionsKeyDown(field, event)}
          className="mt-3 flex flex-wrap gap-2"
        >
          {options.map((option, i) => {
            const picked = Array.isArray(value)
              ? value.includes(option.value)
              : !typing && value === option.value;
            return (
              <Chip
                key={option.value}
                index={i}
                picked={picked}
                label={option.label}
                value={option.value}
                field={field}
              />
            );
          })}
          {field.custom && !field.multiple ? (
            <Chip
              index={options.length}
              picked={typing}
              label={otherLabel(field)}
              field={field}
            />
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}

function Chip({
  field,
  value,
  label,
  picked,
  index,
}: {
  field: Field;
  /** Unset for the "Other" chip. */
  value?: string;
  label: string;
  picked: boolean;
  index: number;
}) {
  const form = useForm();
  const delay = index * TIMING.options;
  return (
    <motion.button
      type="button"
      role="option"
      tabIndex={-1}
      aria-selected={picked}
      aria-label={label}
      data-option={value}
      initial={form.reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...form.spring, delay, opacity: { ...TIMING.fade, delay } }}
      // Picking keeps focus where it was (the blank, or the text being typed).
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        if (event.detail === 0) return;
        if (value === undefined) form.other(field);
        else form.pick(field, value);
      }}
      className={cn(
        CHIP,
        picked
          ? "border-dashed border-current/30 bg-transparent"
          : "border-transparent bg-current/[0.07] hover:bg-current/[0.12]",
      )}
    >
      {value === undefined || !picked ? (
        value === undefined ? (
          label
        ) : (
          <Piece
            id={`c:${field.name}:${value}`}
            kind="chip"
            partner={`f:${field.name}:v:${value}`}
          >
            {label}
          </Piece>
        )
      ) : (
        // The label's imprint stays in the outline, so a pick can be found and sent back.
        <span
          aria-hidden
          className={`opacity-30 transition-opacity ${TIMING.imprint} motion-reduce:delay-0 starting:opacity-0`}
        >
          {label}
        </span>
      )}
    </motion.button>
  );
}

/* ── SentenceFormField ──────────────────────────────────── */

export interface SentenceFormFieldProps {
  /** The field's name in the values and in the submitted FormData. */
  name: string;
  /** Names the field for screen readers, and heads the tray while the blank is active. */
  label: string;
  /** Muted hint shown in the empty blank, like "your name". It sets the blank's width until something's typed. */
  placeholder?: string;
  /** A line in the tray beside the label. Options default to "Pick one" or "Pick any". */
  hint?: React.ReactNode;
  /** Makes the blank a choice. Strings, or `{ value, label }` when the submitted value differs. */
  options?: readonly SentenceFormOption[];
  /** Lets several options be picked. The value becomes a string[] in the order they were picked. */
  multiple?: boolean;
  /** Adds an "Other" chip that turns the blank into a text input. Pass a string to rename the chip. */
  custom?: boolean | string;
  /** Input type for a text blank. "email" and "url" are checked on send. */
  type?: "text" | "email" | "tel" | "url";
  /** Must be filled (or, with `multiple`, have a pick) before the form sends. */
  required?: boolean;
  /** The value it starts with, until it's changed. */
  defaultValue?: string | string[];
  /** Autofill hint for a text blank, like "name", "email" or "organization". */
  autoComplete?: string;
  /** Classes for the blank's words: the input, the picks and the answer once sent. */
  className?: string;
}

/**
 * One blank in a `SentenceForm`. Write it inline in the sentence; it's
 * read by the form, which renders it as a text input or a choice.
 */
export function SentenceFormField(
  props: SentenceFormFieldProps,
): React.ReactNode {
  throw new Error(
    `<SentenceFormField name="${props.name}"> must be written inside <SentenceForm>'s sentence (directly, or inside fragments and conditionals).`,
  );
}
