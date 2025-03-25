import { test as base } from '@playwright/test'
import { Helper } from '../pom/helper'
import { ManagerView } from '../pom/managerOvervie'


// Declare the types of your fixtures.
export type MyOptions = {
  //defaultItem: string
  url: string
}

type MyFixtures = {
  helper: Helper
  managerView: ManagerView
  
}

export const test = base.extend<MyOptions & MyFixtures>({
  
  url: ['/', { option: true }],

  helper: async ({ page }, use) => {
    const helper = new Helper(page)
    await use(helper)
  },

  managerView: async ({ page }, use) => {
    const managerView = new ManagerView(page)
    await use(managerView)
  },


})
export { expect } from '@playwright/test'
