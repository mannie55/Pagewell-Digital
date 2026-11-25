import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * The site's one pill: section labels ("Process", "FAQ") and the small chips
 * on cards. Small semibold text on a quiet tint. On dark sections and cards
 * the colour roles (`.scheme-dark`, `.on-dark`) turn it light by themselves,
 * so there is no dark variant to pick.
 *
 * - `muted`: grey text, for section labels. Chips inherit the card's text.
 * - `as="p"`: a label on its own line above a heading.
 */
export function Tag({
  as: Element = "span",
  muted = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"span"> & {
  as?: "span" | "p";
  muted?: boolean;
}) {
  return (
    <Element
      className={cn(
        "bg-tint text-small inline-flex w-fit items-center rounded-sm px-2 py-0.5 font-semibold",
        muted && "text-muted",
        className,
      )}
      {...props}
    />
  );
}
