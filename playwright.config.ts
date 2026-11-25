import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end checks against a fresh production build (`next build && next start`).
 * Every run rebuilds so the tests never see a stale server; set E2E_REUSE=1 to
 * reuse one already running on :3100 while iterating on a spec.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Videos show their posters, reveals show at once, marquees rest: stable pages.
    reducedMotion: "reduce",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  expect: {
    // Allow anti-aliasing noise, not layout changes. screenshot.css paints
    // sections that skip painting while off screen. Playwright's default
    // `animations: "disabled"` ends finite animations and stops looping ones.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,
      stylePath: "e2e/screenshot.css",
    },
  },
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: process.env.E2E_REUSE === "1",
    timeout: 300_000,
    // The suite must never send a real enquiry email, whatever .env holds.
    env: { RESEND_API_KEY: "", CONTACT_TO_EMAIL: "", CONTACT_FROM_EMAIL: "" },
    stdout: "ignore",
  },
});
