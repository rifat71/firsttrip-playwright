import { Page } from "playwright";
import fs from "fs";
import path from "path";

export class BasePage {
  protected page: Page;
  protected locatorFileName: string;

  constructor(page: Page, locatorFileName?: string) {
    this.page = page;
    this.locatorFileName = locatorFileName || "default";
  }

  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async fill(selector: string, text: string) {
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return (await this.page.textContent(selector)) ?? "";
  }

  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get locator from JSON file.
   * @param key Key inside JSON
   * @param fileName Optional JSON file name (defaults to calling page class)
   */
  protected getLocator(key: string, fileName?: string): string {
    if (!fileName) {
      const err = new Error();
      const stack = err.stack?.split("\n")[2] || "";
      const match = stack.match(/\/pages\/(.*)\.ts/);
      fileName = match ? match[1] : "default";
    }

    const filePath = path.join(process.cwd(), "resources", "locators", `${fileName}.locator.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Locator file not found: ${filePath}`);
    }

    const locators = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!locators[key]) {
      throw new Error(`Locator key "${key}" not found in ${filePath}`);
    }

    return locators[key];
  }

  /**
   * Wait until the element from JSON locator is visible
   * @param key JSON locator
   */
  async waitForVisible(key: string): Promise<boolean> {
    const locator = this.page.locator(key);
    try {
      await locator.waitFor({ state: "visible" });
      return true;
    } catch {
      return false;
    }
  }
}
