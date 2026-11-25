import { expect, test } from "@playwright/test";
import { buildEnquiry, type EnquiryValues } from "../lib/enquiry";

/** The email an enquiry becomes (lib/enquiry.ts, used by the server action). */
test.describe("enquiry email", () => {
  const base: EnquiryValues = {
    name: "Ada Obi",
    email: "ada@example.com",
    services: ["seo", "local-seo"],
  };

  test("carries website, WhatsApp and the services' full names", () => {
    const { body } = buildEnquiry({
      ...base,
      website: " example.co.uk ",
      whatsapp: "+44 7700 900123",
    });
    expect(body).toContain("Website: example.co.uk\n");
    expect(body).toContain("WhatsApp: +44 7700 900123\n");
    expect(body).toContain("Needs: SEO, Local SEO\n");
  });

  test("shows a dash for the optional blanks left empty", () => {
    const { body } = buildEnquiry(base);
    expect(body).toContain("Website: -\n");
    expect(body).toContain("WhatsApp: -\n");
  });

  test("keeps only real services, once each, and caps long answers", () => {
    const { body } = buildEnquiry({
      ...base,
      services: ["seo", "made-up", "seo"],
      website: "a".repeat(300),
    });
    expect(body).toContain("Needs: SEO\n");
    expect(body).toContain(`Website: ${"a".repeat(200)}\n`);
  });

  const refused: [string, EnquiryValues][] = [
    ["no name", { ...base, name: "  " }],
    ["a bad email", { ...base, email: "ada@" }],
    ["no real service", { ...base, services: ["made-up"] }],
  ];
  for (const [what, values] of refused) {
    test(`refuses an enquiry with ${what}`, () => {
      expect(() => buildEnquiry(values)).toThrow("Invalid enquiry");
    });
  }
});

/** The sentence form on /contact, in the browser. */
test.describe("contact form", () => {
  test("won't send until the required blanks are filled", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form");
    await form.getByRole("button", { name: /send enquiry/i }).click();
    await expect(form.getByText("Fill this in to send.").first()).toBeVisible();
  });

  test("offers one choice per service page", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "What you need" }).click();
    await expect(page.getByRole("option")).toHaveText([
      "a new website",
      "SEO",
      "local SEO",
      "AI search",
      "link building",
      "ads",
      "more enquiries",
    ]);
  });

  // The test server has no email settings (playwright.config.ts blanks them),
  // so production refuses to send: the visitor sees the error and keeps every
  // answer, including the new optional ones. The success sentence is checked
  // by hand in development, where a missing key logs the enquiry instead.
  test("a failed send keeps every answer", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form");
    await form.getByLabel("Your name").fill("Ada Obi");
    await form.getByRole("button", { name: "What you need" }).click();
    await page.getByRole("option", { name: "SEO", exact: true }).click();
    await page.keyboard.press("Escape");
    await form.getByLabel("Your website").fill("example.co.uk");
    await form.getByLabel("Email").fill("ada@example.com");
    await form.getByLabel("WhatsApp number").fill("+44 7700 900123");
    await form.getByRole("button", { name: /send enquiry/i }).click();

    await expect(form.getByRole("status")).toHaveText(
      /Sorry, that didn’t send/,
    );
    await expect(form.getByLabel("Your website")).toHaveValue("example.co.uk");
    await expect(form.getByLabel("WhatsApp number")).toHaveValue(
      "+44 7700 900123",
    );
  });
});
