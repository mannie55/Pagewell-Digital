import { expect, test } from "@playwright/test";
import { sitemapPaths } from "./helpers";

/**
 * No page may scroll sideways on a small phone (350px) or a tablet (plan
 * decision 6D). Each page is scrolled to the bottom first so lazily mounted
 * sections (the contact form, card videos) are measured too.
 */
for (const width of [350, 768]) {
  test.describe(`${width}px`, () => {
    test.use({
      viewport: { width, height: 812 },
      isMobile: true,
      hasTouch: true,
    });

    test(`no page scrolls sideways at ${width}px`, async ({
      page,
      request,
    }) => {
      const overflowing: string[] = [];
      for (const path of await sitemapPaths(request)) {
        await page.goto(path);
        const [scrollWidth, clientWidth] = await page.evaluate(async () => {
          const frame = () =>
            new Promise((r) =>
              requestAnimationFrame(() => requestAnimationFrame(r)),
            );
          window.scrollTo(0, document.documentElement.scrollHeight);
          await frame();
          await new Promise((r) => setTimeout(r, 300));
          const root = document.documentElement;
          return [root.scrollWidth, root.clientWidth];
        });
        if (scrollWidth > clientWidth)
          overflowing.push(`${path} (${scrollWidth}px wide)`);
      }
      expect(overflowing).toEqual([]);
    });
  });
}
