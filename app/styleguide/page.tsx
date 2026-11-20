import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

// Internal reference page for comparing tokens against Figma. Not indexed.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const headings = [
  ["heading-h1", "Heading 1"],
  ["heading-h2", "Heading 2"],
  ["heading-h3", "Heading 3"],
  ["heading-h4", "Heading 4"],
  ["heading-h5", "Heading 5"],
  ["heading-h6", "Heading 6"],
] as const;

const bodySizes = [
  ["text-large", "Text large"],
  ["text-medium", "Text medium"],
  ["text-regular", "Text regular"],
  ["text-small", "Text small"],
  ["text-tiny", "Text tiny"],
] as const;

const swatches = [
  "bg-neutral-lightest",
  "bg-neutral-lighter",
  "bg-neutral-light",
  "bg-neutral",
  "bg-neutral-dark",
  "bg-neutral-darker",
  "bg-neutral-darkest",
  "bg-flamingo-lightest",
  "bg-flamingo-lighter",
  "bg-flamingo-light",
  "bg-flamingo",
  "bg-flamingo-dark",
  "bg-flamingo-darker",
  "bg-flamingo-darkest",
];

const shadows = [
  "shadow-xxs",
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
];

function Cube() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L18.7 8 12 11.7 5.3 8 12 4.3Z" />
    </svg>
  );
}

export default function StyleGuide() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-20 px-5 py-16 md:px-16">
      <section className="space-y-6">
        <p className="tagline">Typography</p>
        {headings.map(([cls, label]) => (
          <p key={cls} className={`${cls} font-serif`}>
            {label}
          </p>
        ))}
        <div className="grid gap-6 md:grid-cols-5">
          {bodySizes.map(([cls, label]) => (
            <div key={cls} className={cls}>
              <p className="font-bold">{label} bold</p>
              <p className="font-semibold">{label} semi bold</p>
              <p className="font-medium">{label} medium</p>
              <p>{label} normal</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <p className="tagline">Colors</p>
        <div className="grid grid-cols-7 gap-3">
          {swatches.map((cls) => (
            <div
              key={cls}
              className={`${cls} border-border h-16 rounded-sm border`}
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {["scheme-1", "scheme-2", "scheme-3"].map((s) => (
            <div key={s} className={`${s} border-border rounded-lg border p-6`}>
              <p className="heading-h6 mb-4">{s}</p>
              <div className="bg-foreground border-border text-small rounded-sm border p-4">
                Foreground color
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <p className="tagline">Shadows</p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-7">
          {shadows.map((cls) => (
            <div
              key={cls}
              className={`${cls} text-tiny rounded-sm bg-white p-4`}
            >
              {cls}
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        {(["light", "dark"] as const).map((tone) => (
          <div
            key={tone}
            className={`space-y-4 p-8 ${tone === "dark" ? "bg-neutral-darkest" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <Button tone={tone}>Button</Button>
              <Button tone={tone} variant="secondary">
                Button
              </Button>
              <Button tone={tone} variant="link">
                Button
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button tone={tone} size="sm" iconLeft={<Cube />}>
                Button
              </Button>
              <Button
                tone={tone}
                size="sm"
                variant="secondary"
                iconRight={<Cube />}
              >
                Button
              </Button>
              <Button tone={tone} iconOnly aria-label="Example">
                <Cube />
              </Button>
              <Button tone={tone} href="/" variant="link" iconRight={<Cube />}>
                Link
              </Button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
