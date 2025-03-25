import { expect, Locator, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

interface IAddCustomerView {
  firstName: Locator;
  lastName: Locator;
  postalCode: Locator;
  addCustomerBtn: Locator;
}

export class Helper {
  readonly page: Page;
  readonly addCustomerView: IAddCustomerView;

  constructor(page: Page) {
    this.page = page;
    this.addCustomerView = {
      firstName: page.locator('input[placeholder="First Name"]'),
      lastName: page.locator('input[placeholder="Last Name"]'),
      postalCode: page.locator('input[placeholder="Postal Code"]'),
      addCustomerBtn: page.locator('button[type="Submit"]'),
    };
  }

  async generateRandomUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode(),
    };
  }
}
