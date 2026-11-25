import type { APIRequestContext, Page } from "@playwright/test";

/** Every page the sitemap publishes, as paths ("/", "/about", …). */
export async function sitemapPaths(request: APIRequestContext) {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );
}

/**
 * Walks down the page so every lazy image, lazily mounted section and
 * on-view reveal has loaded, then returns to the top and waits for fonts and
 * images. Leaves the page as a first-time visitor would see it, fully loaded.
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    // Two painted frames plus a beat, so IntersectionObservers have reported.
    const frames = () =>
      new Promise((r) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTimeout(r, 80)),
        ),
      );
    await document.fonts.ready;
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await frames();
    }
    // A busy machine can skip a block on the way down: visit any still hidden.
    // (The About stage's blur blocks are driven by its own scroll position.)
    const hidden = document.querySelectorAll<HTMLElement>(
      ".soft-reveal:not([data-shown]):not(.soft-reveal-blur)",
    );
    for (const el of hidden) {
      el.scrollIntoView({ block: "center" });
      await frames();
    }
    window.scrollTo(0, 0);
    await frames();
  });
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() =>
    Array.from(document.images).every((img) => img.complete),
  );
  await page.waitForTimeout(500);
}
