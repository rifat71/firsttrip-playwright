# Playwright Flight Booking Automation Framework

## Overview

This repository contains a Playwright-based UI automation framework designed to test flight booking workflows on [FirstTrip](https://firsttrip.com/flight).

It follows a **Page Object Model (POM)** structure, uses locators stored in JSON files, captures screenshots of failed tests, and generates HTML reports.

---

## Folder Structure

```
.
├── pages/
│   ├── basePage.ts          # Base page with reusable actions (click, fill, wait, etc.)
│   ├── flightHomePage.ts    # Page object for flight search page
│   ├── searchResultsPage.ts# Page object for search results
│   └── signInPage.ts        # Page object for Sign-In modal
│
├── resources/
│   └── locators/
│       ├── flightHomePage.locator.json
│       ├── searchResultPage.locator.json
│       └── signInPage.locator.json
│
├── tests/
│   ├── ui/
│   │   └── flightBooking.spec.ts  # Example UI test for flight booking
│   └── api/                        # Placeholder for future API tests
│
├── utils/
│   └── pageNavigator.ts      # Handles page navigation
│
├── .env                      # Environment variables (HEADLESS)
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── package.json
└── .gitignore
```

---

## Locators

* Each page has its own JSON locator file in `resources/locators/`.
* Example: `flightHomePage.locator.json`

```json
{
  "oneWayRadioButton": "//div[@data-testid='One Way-input']",
  "from": "(//input[@placeholder='Airport/City'])[1]",
  "to": "(//input[@placeholder='Airport/City'])[2]",
  "departureButton": "//button[@data-testid='departure-date-input-form-1']",
  "datePicker4thWeek": "(//div[@class='react-datepicker__month-container'])[1]/div[2]/div[4]/div[text()='{index}']",
  "selectTravellers": "//div[@data-testid='select-traveller-input']",
  "increaseAdultButton": "//p[@data-testid='adult-number-add-button']",
  "numberOfAdultsText": "//p[@data-testid='adult-number-add-button']/preceding-sibling::p[1]",
  "economyOrPremiumEconomy": "//div[@data-testid='Economy/Premium Economy-class']",
  "searchFlightButton": "//button[@data-testid='search-flight-button']"
}
```

* Locators are referenced in page classes using the `getLocator()` method from `BasePage`.

---

## Page Object Model (POM)

* **BasePage:** Contains reusable actions (`click`, `fill`, `getText`, `waitForVisible`) and handles locator JSON reading.
* **FlightHomePage:** Handles flight search inputs and buttons.
* **SearchResultsPage:** Handles filtering airlines, selecting flights, and capturing flight prices.
* **SignInPage:** Verifies presence of Sign-In modal elements.

---

## Environment Variables

* `.env` contains:

```
HEADLESS=false
```

* `HEADLESS` determines if the browser runs in headless mode.

---

## Playwright Configuration (`playwright.config.ts`)

```ts
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
```

* Screenshots and videos of failed tests are saved in `test-results/`.
* HTML reports are generated in `playwright-report/`.

---

## Running Tests

1. Install dependencies:

```bash
npm install
```

2. Run all UI tests:

```bash
npx playwright test
```

3. Run only flight booking tests (tagged `@ui`):

```bash
npx playwright test --grep @ui
```

4. Open HTML report after the run:

```bash
npx playwright show-report playwright-report
```

---

## Adding New Tests

1. Add new `.spec.ts` files under `tests/ui/`.
2. Use the existing page objects (`FlightHomePage`, `SearchResultsPage`, `SignInPage`) for interaction.
3. Use JSON locators in `resources/locators/` for any new page elements.

---

## CI/CD Integration

The workflow runs Playwright Page Object Model (POM) UI tests using GitHub Actions.

### Trigger

Manually via **Workflow Dispatch**.

### Inputs

* **headless**: Run tests in headless mode (`true` / `false`, default `false`).

### How It Works

* Runs tests in parallel for each folder in the matrix (`dummyFolder 1`, `dummyFolder 2`).
* Steps:

  1. Checkout repo
  2. Setup Node.js 20.x
  3. Install Playwright dependencies & browser
  4. Install project dependencies
  5. Run POM tests (`HEADLESS` mode applied)
  6. Rename HTML report per folder
  7. Upload report as artifact

### Access Reports

Download HTML reports from **Artifacts**: `playwright-report-<folder>.html`.

### Example

Run workflow → select **headless** → workflow runs tests per folder in parallel.

---

## Reports & Artifacts

* `test-results/` folder contains:

  * Screenshots of failed tests
  * Videos of failed tests
  * HTML report: `playwright-report/index.html`
* **Usage:** Open the report after the test to check pass/fail status and see screenshots.

---

## Design Pattern

* **POM Structure:** Keeps selectors and page actions separate for maintainability.
* **Locator JSONs:** Makes it easy to update selectors without touching code.
* **Environment Variables:** Allows running headless or headed browser dynamically.
* **HTML Reports & Screenshots:** Provides clear failure context for debugging.
* **Flexible Test Tags:** Allows selective test execution (`@ui`, `@wip`).

---

## Future Enhancements

* Add more UI test scenarios.
* Integrate API tests under `tests/api/`.
* Add CI/CD pipelines update based on the requirements of the project
* Complete the sign-in modal functionality
