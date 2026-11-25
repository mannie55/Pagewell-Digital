import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * primary   — scheme accent (near-black on light sections)
 * brand     — Flamingo; reserved for the single highest-priority CTA (navbar)
 * secondary — 5% tint
 * link      — text only
 */
type Variant = "primary" | "brand" | "secondary" | "link";
type Size = "md" | "sm";
type Tone = "light" | "dark";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  /** Use "dark" when the button sits on a dark section. */
  tone?: Tone;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Square icon-only button; pass the icon as children and an aria-label. */
  iconOnly?: boolean;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ComponentProps<"button">, keyof BaseProps> & { href?: undefined };
type ButtonAsLink = BaseProps &
  Omit<ComponentProps<typeof Link>, keyof BaseProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex shrink-0 items-center justify-center gap-3 rounded-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

/** Focus ring contrasts with the section behind the button, not its own text (white text gave a white ring on white). */
const rings: Record<Tone, string> = {
  light: "focus-visible:outline-neutral-darkest",
  dark: "focus-visible:outline-white",
};

const variants: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-accent text-white hover:bg-neutral-darker",
    brand: "bg-flamingo-dark text-white hover:bg-flamingo-darker",
    secondary: "bg-tint text-neutral-darkest hover:bg-tint-strong",
    link: "text-neutral-darkest hover:underline underline-offset-4",
  },
  dark: {
    primary: "bg-white text-neutral-darkest hover:bg-neutral-lightest",
    brand: "bg-flamingo-dark text-white hover:bg-flamingo-darker",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    link: "text-white hover:underline underline-offset-4",
  },
};

const sizes: Record<Size, { text: string; icon: string }> = {
  md: { text: "px-6 py-3 text-regular", icon: "size-12 text-regular" },
  sm: { text: "px-5 py-2 text-regular", icon: "size-11 text-regular" },
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    tone = "light",
    iconLeft,
    iconRight,
    iconOnly = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    base,
    rings[tone],
    variants[tone][variant],
    variant === "link" ? "p-0" : iconOnly ? sizes[size].icon : sizes[size].text,
    className,
  );

  const content = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if (typeof rest.href === "string") {
    const linkProps = rest as Omit<ButtonAsLink, keyof BaseProps>;
    return (
      <Link {...linkProps} className={classes}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as Omit<ButtonAsButton, keyof BaseProps>;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {content}
    </button>
  );
}
