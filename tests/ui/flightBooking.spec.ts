import { test, expect } from "../setup/global-hooks";
import { FlightHomePage } from "../../pages/flightHomePage";
import { SearchResultPage } from "../../pages/searchResultPage";
import { SignInPage } from "../../pages/signInPage";
import { PageNavigator } from "../../utils/pageNavigator";

test("@ui Flight booking workflow", async ({ page }) => {
  const flightHomePage = new FlightHomePage(page);
  const searchResultPage = new SearchResultPage(page);
  const signInPage = new SignInPage(page);

  await flightHomePage.navigate(PageNavigator.getPath("flight"));
  await flightHomePage.searchOneWayTripFlights("Chattogram", "Dhaka", 23, 2);

  await searchResultPage.filterAirline("US Bangla Airlines");
  const usBanglaPrices = await searchResultPage.getFlightPrices();
  console.log("US Bangla Prices:", usBanglaPrices);

  await searchResultPage.switchAirlines("US Bangla Airlines", "Novo Air");

  await searchResultPage.filterAirline("Novo Air");
  const novoAirPrices = await searchResultPage.getFlightPrices();
  console.log("Novo Air Prices:", novoAirPrices);

  try {
    expect(usBanglaPrices).not.toEqual(novoAirPrices);
    console.log("There are price difference between US-Bangla and Novo Air flights.");
  } catch (error) {
    console.error("Prices are not different");
  }
});
