import { expect, test } from "@playwright/test";
import { settle } from "./helpers";

/**
 * The approved desktop look (founder, 2026-11-25), baselined at commit 2239c0e.
 * At 1440px the fluid type tokens equal the old desktop sizes, so nothing here
 * should move unless a task changes it on purpose. When one does, re-take the
 * affected pictures in that same commit and review the diff images:
 *   npm run test:e2e -- desktop-look --update-snapshots
 * Animation timing (hero words, About stage) is checked by hand, not here.
 */
const pages = {
  home: "/",
  services: "/services",
  "service-seo": "/services/seo",
  work: "/work",
  "case-study": "/work/elite-learning-innovations",
  about: "/about",
  contact: "/contact",
};

test.use({ viewport: { width: 1440, height: 900 } });
// Settling plus two full-page captures of the 12,700px home page can pass
// 30s when other workers share the CPU. One retry absorbs a rare capture of a
// card video's background mid-swap (about 1 in 60 runs); Playwright still
// reports such a pass as "flaky".
test.describe.configure({ timeout: 90_000, retries: 1 });

for (const [name, path] of Object.entries(pages)) {
  test(`desktop look: ${name}`, async ({ page }) => {
    await page.goto(path);
    await settle(page);
    // Full-page shots of the long pages need more than the default 5s. The
    // stat counters restart their fade when a full-page capture resizes the
    // page, so every shot catches them blank; they are masked (and change with
    // T1's real numbers anyway).
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      timeout: 30_000,
      mask: [page.locator('[aria-labelledby="social-proof-heading"] dd')],
    });
  });
}
