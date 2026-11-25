import { expect, test } from "@playwright/test";
import { sitemapPaths } from "./helpers";

const NOINDEX = /<meta name="robots" content="noindex"/;

test("every sitemap page loads and can be indexed", async ({ request }) => {
  const paths = await sitemapPaths(request);
  expect(paths.length).toBeGreaterThanOrEqual(16);
  for (const path of paths) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(await res.text(), path).not.toMatch(NOINDEX);
  }
});

// Search engines must see a real 404, not a 200 "soft 404".
for (const path of ["/nope", "/work/nope", "/services/nope"]) {
  test(`unknown URL ${path} returns 404 with noindex`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(404);
    expect(await res.text()).toMatch(NOINDEX);
  });
}
