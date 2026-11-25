import { expect, test } from "@playwright/test";

/**
 * Word-by-word headings: each word is its own box for the animation, so screen
 * readers get the full sentence instead (aria-label on headings, hidden text
 * on the one paragraph) and the word boxes are hidden from them.
 */
const headings = [
  ["hero-heading", "The website growth your business needs"],
  ["problem-heading", "Your website isn’t broken. It’s invisible."],
  [
    "about-heading",
    "At Pagewell, we build websites that go beyond looking good",
  ],
  ["contact-heading", "Tell us about your project"],
] as const;

test("animated headings read as one sentence", async ({ page }) => {
  await page.goto("/");
  for (const [id, sentence] of headings) {
    const heading = page.locator(`#${id}`);
    await expect(heading).toHaveAccessibleName(sentence);
    await expect(heading.locator('span:not([aria-hidden="true"])')).toHaveCount(
      0,
    );
  }
});

test("the About statement paragraph carries its sentence as text", async ({
  page,
}) => {
  await page.goto("/");
  const statement = page.locator("p:has(> .sr-only)", {
    hasText: "Every project is built with purpose",
  });
  await expect(statement.locator("> .sr-only")).toHaveText(
    "Every project is built with purpose, designed to engage, and structured to grow with your business. Whether you’re starting fresh or refining a brand, we use AI to move faster while people make every creative call.",
  );
});
