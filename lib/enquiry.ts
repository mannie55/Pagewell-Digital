import { getService } from "@/data/services";

export type EnquiryValues = Record<string, string | string[]>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "").trim().slice(0, max);

/**
 * Turns the contact form's answers into the enquiry email. Every field is
 * trimmed and capped; "help with" choices are service slugs, and only ones
 * that match a service page are kept (as the service's full name). Throws on
 * anything the form itself would never send: no name, a bad email, or no
 * known service. Website and WhatsApp are optional.
 */
export function buildEnquiry(values: EnquiryValues) {
  const name = text(values.name, 120);
  const company = text(values.company, 160);
  const email = text(values.email, 200);
  const timeline = text(values.timeline, 120);
  const website = text(values.website, 200);
  const whatsapp = text(values.whatsapp, 40);
  const picked = Array.isArray(values.services) ? values.services : [];
  const needs = [
    ...new Set(
      picked
        .map((slug) => getService(text(slug, 60))?.name)
        .filter((n): n is string => Boolean(n)),
    ),
  ];

  if (!name || !EMAIL.test(email) || !needs.length) {
    throw new Error("Invalid enquiry");
  }

  const body = [
    `Name: ${name}`,
    `Company: ${company || "-"}`,
    `Email: ${email}`,
    `Website: ${website || "-"}`,
    `WhatsApp: ${whatsapp || "-"}`,
    `Needs: ${needs.join(", ")}`,
    `Timeline: ${timeline || "-"}`,
  ].join("\n");

  return { name, email, body };
}
