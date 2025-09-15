import { Page } from "playwright";
import { BasePage } from "./basePage";

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isVisible(): Promise<boolean> {
    const titleVisible = await this.waitForVisible(this.getLocator("title"));
    const emailVisible = await this.waitForVisible(this.getLocator("emailInput"));
    return titleVisible && emailVisible;
  }
}
