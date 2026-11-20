"use server";

type Values = Record<string, string | string[]>;

const text = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "").trim().slice(0, max);

/**
 * Receives the contact form. Sends the enquiry by email through Resend when
 * RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are set. Without
 * them it only succeeds in development (logging the enquiry); in production it
 * fails loudly so an enquiry is never silently dropped.
 */
export async function sendInquiry(values: Values) {
  const name = text(values.name, 120);
  const company = text(values.company, 160);
  const email = text(values.email, 200);
  const timeline = text(values.timeline, 120);
  const services = (Array.isArray(values.services) ? values.services : [])
    .map((s) => text(s, 60))
    .filter(Boolean)
    .slice(0, 8);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !services.length) {
    throw new Error("Invalid enquiry");
  }

  const body = [
    `Name: ${name}`,
    `Company: ${company || "-"}`,
    `Email: ${email}`,
    `Needs: ${services.join(", ")}`,
    `Timeline: ${timeline || "-"}`,
  ].join("\n");

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
