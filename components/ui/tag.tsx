import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Design-system Tag: small semibold label on a 5% tint. */
export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-tint text-small text-neutral-darkest inline-flex rounded-sm px-2.5 py-1 font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}
