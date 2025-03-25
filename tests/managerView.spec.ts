import { expect, chromium } from "@playwright/test";
import { test } from "../playwright/fixtures";
import * as fs from "fs";
import { Helper } from "../pom/helper";
import { ManagerView } from "../pom/managerOvervie";

const data = JSON.parse(fs.readFileSync("./dataTest/data.json", "utf-8"));

test("Verify adding a new customer", async ({ page, helper, managerView }) => {
  await page.goto(data.baseURL + data.addCustomerUrl);
  const user = await helper.generateRandomUser();
  await managerView.addCustomer({
    firstName: user.firstName,
    lastName: user.lastName,
    postalCode: user.postalCode,
  });
});

test("Verify customer added appear in the Customers list", async ({
  page,
  helper,
  managerView,
}) => {
  await page.goto(data.baseURL + data.addCustomerUrl);

  const user = await helper.generateRandomUser();
  await managerView.addCustomer({
    firstName: user.firstName,
    lastName: user.lastName,
    postalCode: user.postalCode,
  });
  await managerView.customerListBtn.click();

  const customerRow = page.locator("table tbody tr", {
    hasText: `${user.firstName} ${user.lastName} ${user.postalCode}`,
  });
  await customerRow.scrollIntoViewIfNeeded();
  await expect(customerRow).toBeVisible();
});

//failed test due to the user are no longer in the list after reopen the broser:
test("Verify customer added appear in the Customers list after closing and reopen the browser", async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(data.baseURL + data.addCustomerUrl);
  const managerView = new ManagerView(page);
  const helper = new Helper(page);

  const user = await helper.generateRandomUser();
  await managerView.addCustomer({
    firstName: user.firstName,
    lastName: user.lastName,
    postalCode: user.postalCode,
  });
  await managerView.customerListBtn.click();
  const customerRow = page.locator("table tbody tr", {
    hasText: `${user.firstName} ${user.lastName} ${user.postalCode}`,
  });
  await expect(customerRow).toBeVisible();

  await browser.close();
  const reopenedBrowser = await chromium.launch({ headless: false });
  const reopenedContext = await reopenedBrowser.newContext();
  const reopenedPage = await reopenedContext.newPage();

  await reopenedPage.goto(data.baseURL + data.customerList);

  const reopenedCustomerRow = reopenedPage.locator("table tbody tr", {
    hasText: `${user.firstName} ${user.lastName} ${user.postalCode}`,
  });
  await expect(reopenedCustomerRow).toBeVisible();

  await reopenedBrowser.close();
});

test("Verify deposit work as expected", async ({
  page,
  helper,
  managerView,
}) => {
  await page.goto(data.baseURL);
  await managerView.login("Ron Weasly");
  await managerView.deposit(400);
});

test("Verify open an account", async ({ page, helper, managerView }) => {
  await page.goto(data.baseURL + data.openAccountUrl);

  const accountNumber = await managerView.openAccount({
    customer: "Ron Weasly",
    currency: "Dollar",
  });
  console.log("Generated Account Number:", accountNumber);
});
