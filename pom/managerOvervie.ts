import { expect, Locator, Page } from "@playwright/test";

interface IAddCustomerDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

interface IOpenAccountDetails {
  customer: string;
  currency: string;
}

export class ManagerView {
  readonly page: Page;
  readonly addCustomerView: {
    firstName: Locator;
    lastName: Locator;
    postalCode: Locator;
    addCustomerBtn: Locator;
  };
  readonly openAccountView: {
    customerSelect: Locator;
    currencySelect: Locator;
    processBtn: Locator;
  };
  readonly customerListBtn: Locator;
  readonly customerLoginBtn: Locator;
  readonly submitBtn: Locator;
  readonly depositBtn: Locator;
  readonly amountInput: Locator;
  readonly balanceValue: Locator;
  readonly depositSuccesfulMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addCustomerView = {
      firstName: page.locator('input[placeholder="First Name"]'),
      lastName: page.locator('input[placeholder="Last Name"]'),
      postalCode: page.locator('input[placeholder="Post Code"]'),
      addCustomerBtn: page.locator('button[type="Submit"]'),
    };
    this.openAccountView = {
      customerSelect: page.locator('select[name="userSelect"]'),
      currencySelect: page.locator('select[name="currency"]'),
      processBtn: page.locator('button[type="Submit"]'),
    };
    this.customerListBtn = page.locator('button[ng-click="showCust()"]');
    this.customerLoginBtn = page.locator('button[ng-click="customer()"]');
    this.submitBtn = page.locator('button[type="Submit"]');
    this.depositBtn = page.locator('button[ng-click="deposit()"]');
    this.amountInput = page.locator('input[ng-model="amount"]');
    this.balanceValue = page.locator("div.center strong").nth(1);
    this.depositSuccesfulMsg = page.locator('span[ng-show="message"]');
  }

  async addCustomer(details: IAddCustomerDetails): Promise<void> {
    for (const [key, value] of Object.entries(details)) {
      const field = this.addCustomerView[key as keyof IAddCustomerDetails]; // Get the field based on the key
      if (field) {
        await field.pressSequentially(value);
      }
    }
    await this.addCustomerView.addCustomerBtn.click();

    this.page.once("dialog", async (dialog) => {
      const alertMessage = dialog.message();
      console.log("Dialog message:", alertMessage);
      await expect(alertMessage).toMatch(
        /Customer added successfully with customer id :\d+/
      );
      await dialog.accept();
    });
  }

  async login(user: string) {
    await this.customerLoginBtn.click();

    const customerOption = await this.page.locator(
      `#userSelect option:has-text("${user}")`
    );
    const value = await customerOption.getAttribute("value");

    if (value) {
      await this.page.locator("#userSelect").selectOption({ value });
    }
    await this.submitBtn.click();
    await this.page.waitForURL(/account/);
    expect(this.page.getByText("Welcome")).toBeVisible();
  }

  async deposit(value: number) {
    let currentValue = await this.returnValueFromBalance();
    await this.depositBtn.click();
    await this.amountInput.pressSequentially(value.toString());
    await this.submitBtn.click();
    expect(this.depositSuccesfulMsg).toBeVisible();
    let newValue = await this.returnValueFromBalance();
    expect(newValue).toEqual(currentValue + value);
  }

  async returnValueFromBalance() {
    const priceText = await this.balanceValue.innerText();
    const priceNumber = parseFloat(priceText.replace(/[^\d.-]/g, ""));
    return priceNumber;
  }

  async openAccount(details: IOpenAccountDetails): Promise<string> {
    const customerOption = await this.openAccountView.customerSelect.locator(
      `option:has-text("${details.customer}")`
    );
    const customerValue = await customerOption.getAttribute("value");

    if (customerValue) {
      await this.openAccountView.customerSelect.selectOption({
        value: customerValue,
      });
    }

    const currencyOption = await this.openAccountView.currencySelect.locator(
      `option:has-text("${details.currency}")`
    );
    const currencyValue = await currencyOption.getAttribute("value");

    if (currencyValue) {
      await this.openAccountView.currencySelect.selectOption({
        value: currencyValue,
      });
    }

    await this.openAccountView.processBtn.click();

    return new Promise<string>((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const alertMessage = dialog.message();
        console.log("Dialog message:", alertMessage);

        const accountNumberMatch = alertMessage.match(/account number :(\d+)/);
        if (accountNumberMatch) {
          const accountNumber = accountNumberMatch[1];
          await dialog.accept();
          resolve(accountNumber);
        }
      });
    });
  }
}
