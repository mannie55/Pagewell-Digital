import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Small semibold labels: the section label above a heading ("Process",
 * "FAQ") and the chips on cards. On dark sections and cards the colour roles
 * (`.scheme-dark`, `.on-dark`) turn them light by themselves, so there is no
 * dark variant to pick.
 *
 * - `muted`: a section label, plain grey text with no fill.
 * - default: a chip, a pill on a quiet tint that inherits the card's text.
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
        "text-small inline-flex w-fit items-center font-semibold",
        muted ? "text-muted" : "bg-tint rounded-sm px-2 py-0.5",
        className,
      )}
      {...props}
    />
  );
}
