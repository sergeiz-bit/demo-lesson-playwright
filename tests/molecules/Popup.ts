import { expect, Locator, Page } from '@playwright/test'

export class Popup {
  readonly page: Page
  readonly popupLocator: Locator

  constructor(page: Page, selector: string) {
    this.page = page
    this.popupLocator = page.locator(selector)
  }

  async toHaveTitle(title: string): Promise<void> {
    await expect(this.popupLocator).toBeVisible()
    await expect(this.popupLocator).toContainText(title)
  }

}
