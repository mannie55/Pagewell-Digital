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
 * The words stay real text in the HTML, in order, so search engines and screen
 * readers read the heading as one normal sentence.
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
