"use client";

import dynamic from "next/dynamic";
import { useNearViewport } from "@/lib/use-near-viewport";

// The sentence form is the heaviest script on the page and sits at the very
// bottom, so it loads only when the visitor scrolls near it.
const ContactForm = dynamic(
  () => import("./contact-form").then((m) => m.ContactForm),
  { ssr: false },
);

export function ContactFormLazy() {
  const { ref, near } = useNearViewport<HTMLDivElement>({ margin: "800px" });
  return (
    <div ref={ref} className="min-h-[30rem] sm:min-h-[24rem]">
      {near ? <ContactForm /> : null}
    </div>
  );
}
