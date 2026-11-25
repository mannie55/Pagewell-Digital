"use client";

import { sendInquiry } from "@/app/actions/contact";
import { SentenceForm, SentenceFormField } from "@/components/ui/sentence-form";

const answer = "accent-serif text-flamingo-dark";

const firstName = (name: string | string[] | undefined) =>
  String(name ?? "")
    .trim()
    .split(/\s+/)[0];

/** Contact form written as a sentence; each blank opens its own input or choices. */
export function ContactForm() {
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
        options={[
          "web design",
          "web development",
          "AI & automation",
          "SEO & visibility",
        ]}
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
      />
      .
    </SentenceForm>
  );
}
