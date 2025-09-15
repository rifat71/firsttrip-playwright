import { Page } from "playwright";
import { BasePage } from "./basePage";

export class SearchResultPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async filterAirline(airlineName: string) {
    const filterLocator = this.getLocator("filterAirline").replace("{name}", airlineName);
    const filterElement = this.page.locator(filterLocator);
    await filterElement.waitFor({ state: "visible", timeout: 10000 });
    await filterElement.click();
  }

  async pickLastFlight() {
    const resultText = await this.getText(this.getLocator("flightResultCount"));
    const match = resultText.match(/Showing (\d+)/);
    if (!match) throw new Error("Could not determine flight count");

    const totalFlights = parseInt(match[1], 10);
    const lastFlightIndex = totalFlights - 1;

    const selectLocator = this.getLocator("dynamicFlightSelect").replace("{index}", lastFlightIndex.toString());
    const selectButton = this.page.locator(selectLocator);
    await selectButton.waitFor({ state: "visible", timeout: 10000 });
    await selectButton.click();
  }

  async getFlightPrices(): Promise<number[]> {
    const resultText = await this.getText(this.getLocator("flightResultCount"));
    const totalFlights = parseInt(resultText.match(/\d+/)?.[0] ?? "0");
    const prices: number[] = [];

    for (let i = 0; i < totalFlights; i++) {
      const priceSelector = this.getLocator("flightCardPriceSection").replace("{index}", i.toString());
      const priceElement = this.page.locator(priceSelector);
      await priceElement.waitFor({ state: "visible", timeout: 10000 });

      const priceText = await priceElement.textContent();
      if (!priceText) throw new Error(`Price not found for flight ${i}`);
      const priceNumber = parseInt(priceText.replace(/[^\d]/g, ""));
      prices.push(priceNumber);
    }

    return prices;
  }

  async switchAirlines(deselectAirline: string | null, selectAirline: string | null) {
    if (deselectAirline) {
      const deselectLocator = this.getLocator("filterAirline").replace("{index}", deselectAirline);
      const deselectElement = this.page.locator(deselectLocator);
      await deselectElement.waitFor({ state: "visible", timeout: 10000 });
      await deselectElement.click();
    }

    if (selectAirline) {
      const selectLocator = this.getLocator("filterAirline").replace("{index}", selectAirline);
      const selectElement = this.page.locator(selectLocator);
      await selectElement.waitFor({ state: "visible", timeout: 10000 });
      await selectElement.click();
    }
  }
}
