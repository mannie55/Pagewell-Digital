"use client";

import { sendInquiry } from "@/app/actions/contact";
import {
  SentenceForm,
  SentenceFormField,
  type SentenceFormOption,
} from "@/components/ui/sentence-form";

const answer = "accent-serif text-flamingo-dark";

const firstName = (name: string | string[] | undefined) =>
  String(name ?? "")
    .trim()
    .split(/\s+/)[0];

/**
 * Contact form written as a sentence; each blank opens its own input or
 * choices. `choices` are the service pages (data/services.ts), passed in by
 * the server so this client bundle doesn't carry the services file.
 */
export function ContactForm({
  choices,
}: {
  choices: readonly SentenceFormOption[];
}) {
  return (
    <SentenceForm
      onSubmit={(values) => sendInquiry(values)}
      locale="en"
      submitLabel="Send enquiry"
      errorMessage="Sorry, that didn’t send. Please try again in a moment."
      className="heading-h4 min-h-[30rem] font-sans leading-[1.45] sm:min-h-[24rem]"
      submitClassName="rounded-sm text-base"
      success={({ values, edit }) => (
        <p className="text-regular text-muted max-w-md">
          Thanks, {firstName(values.name)}. We’ll reply to{" "}
          <span className="text-neutral-darkest wrap-anywhere">
            {values.email}
          </span>{" "}
          soon.{" "}
          <button
            type="button"
            onClick={edit}
            className="text-neutral-darkest cursor-pointer rounded-sm font-medium underline underline-offset-4 focus-visible:outline-2"
          >
            Edit
          </button>
        </p>
      )}
    >
      Hi, I’m{" "}
      <SentenceFormField
        name="name"
        label="Your name"
        placeholder="your name"
        autoComplete="name"
        className={answer}
        required
      />{" "}
      from{" "}
      <SentenceFormField
        name="company"
        label="Company"
        placeholder="your company"
        autoComplete="organization"
        className={answer}
      />
      . We’d like help with{" "}
      <SentenceFormField
        name="services"
        label="What you need"
        placeholder="a few things"
        options={choices}
        multiple
        className={answer}
        required
      />
      , ideally{" "}
      <SentenceFormField
        name="timeline"
        label="Timeline"
        placeholder="when"
        options={[
          "as soon as possible",
          "in the next few months",
          "with no fixed date",
        ]}
        custom
        className={answer}
      />
      . Our website is{" "}
      <SentenceFormField
        name="website"
        label="Your website"
        placeholder="your-site.com"
        type="url"
        autoComplete="url"
        hint="Optional"
        className={answer}
      />
      . You can reach me at{" "}
      <SentenceFormField
        name="email"
        label="Email"
        placeholder="you@company.com"
        type="email"
        autoComplete="email"
        hint="Only used to reply"
        className={answer}
        required
      />{" "}
      or WhatsApp me on{" "}
      <SentenceFormField
        name="whatsapp"
        label="WhatsApp number"
        placeholder="your number"
        type="tel"
        autoComplete="tel"
        hint="Optional"
        className={answer}
      />
      .
    </SentenceForm>
  );
}
