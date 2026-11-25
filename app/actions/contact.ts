"use server";

import { buildEnquiry, type EnquiryValues } from "@/lib/enquiry";

/**
 * Receives the contact form. Sends the enquiry by email through Resend when
 * RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are set. Without
 * them it only succeeds in development (logging the enquiry); in production it
 * fails loudly so an enquiry is never silently dropped.
 */
export async function sendInquiry(values: EnquiryValues) {
  const { name, email, body } = buildEnquiry(values);

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[contact] email not configured, enquiry logged only:\n" + body,
      );
      return;
    }
    throw new Error("Contact email is not configured");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `New website enquiry from ${name}`,
      text: body,
    }),
  });
  if (!res.ok) throw new Error(`Email send failed (${res.status})`);
}
