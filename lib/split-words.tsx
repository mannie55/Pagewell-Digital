import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/**
 * Walks a heading's children and wraps every word with `wrap`, keeping spaces
 * and inline elements (like the italic accent <em>) exactly where they were.
 * The words stay real text in the HTML, in order, so search engines read the
 * heading once, as written. For screen readers use `splitForReveal`: one box
 * per word can be read as separate pieces.
 */
export function splitWords(
  node: ReactNode,
  wrap: (word: string, index: number) => ReactNode,
  counter = { i: 0 },
): ReactNode {
  if (typeof node === "string") {
    return node
      .split(/(\s+)/)
      .map((part) => (part.trim() ? wrap(part, counter.i++) : part));
  }
  if (Array.isArray(node)) {
    return Children.toArray(node).map((child) =>
      splitWords(child, wrap, counter),
    );
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(
      el,
      undefined,
      splitWords(el.props.children, wrap, counter),
    );
  }
  return node;
}

/** The plain text of some JSX, spaces collapsed: what a screen reader should hear. */
export function textOf(node: ReactNode): string {
  const walk = (n: ReactNode): string => {
    if (typeof n === "string" || typeof n === "number") return String(n);
    if (Array.isArray(n)) return n.map(walk).join("");
    if (isValidElement(n))
      return walk((n as ReactElement<{ children?: ReactNode }>).props.children);
    return "";
  };
  return walk(node).replace(/\s+/g, " ").trim();
}

/**
 * Splits text into animated word boxes that screen readers skip
 * (`aria-hidden`), and returns the full sentence for them to read instead.
 * On a heading, pass `label` as its `aria-label`; ARIA doesn't allow a label
 * on a paragraph, so a paragraph carries `label` as visually hidden text.
 */
export function splitForReveal(
  node: ReactNode,
  wrap: (word: string, index: number) => ReactElement,
) {
  return {
    label: textOf(node),
    words: splitWords(node, (word, i) =>
      cloneElement(wrap(word, i) as ReactElement<{ "aria-hidden"?: boolean }>, {
        "aria-hidden": true,
      }),
    ),
  };
}
