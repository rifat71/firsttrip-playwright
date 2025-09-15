import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 10 * 1000,
  retries: 0,
  use: {
    actionTimeout: 10000,
    browserName: "chromium",
    headless: process.env.HEADLESS === "true",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    baseURL: process.env.BASE_URL || "https://firsttrip.com/flight",
  },
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
});
