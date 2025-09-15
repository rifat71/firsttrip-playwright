import { Page } from "playwright";
import { BasePage } from "./basePage";

export class FlightHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async searchOneWayTripFlights(from: string, to: string, date: number, adults: number) {
    await this.click(this.getLocator("oneWayRadioButton"));

    await this.click(this.getLocator("from"));
    await this.fill(this.getLocator("from"), from);
    await this.click(`//*[text()='Shah Amanat International Airport']`);

    await this.click(this.getLocator("to"));
    await this.fill(this.getLocator("to"), to);
    await this.click(`//*[text()='Hazrat Shahjalal International Airport']`);

    await this.click(this.getLocator("departureButton"));
    const locator = this.getLocator("datePicker4thWeek").replace("{index}", date.toString());
    await this.click(locator);
    

    await this.click(this.getLocator("selectTravellers"));
    for (let i = 1; i < adults; i++) {
      await this.click(this.getLocator("increaseAdultButton"));
    }

    await this.click(this.getLocator("economyOrPremiumEconomy"));
    await this.click(this.getLocator("searchFlightButton"));
  }
}
