import { test as base, expect } from "@playwright/test";

// Extend the base test
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    // After each test, if failed, attach screenshot
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      testInfo.attachments.push({
        name: "screenshot",
        body: screenshot,
        contentType: "image/png",
      });
    }
  },
});

export { expect };
