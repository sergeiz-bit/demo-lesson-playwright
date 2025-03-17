import { BasePage } from './base-page'
import { Locator, Page } from '@playwright/test'

export class OrderDetailsPage extends BasePage {
  readonly orderStatus: Locator

  constructor(page: Page) {
    super(page)
    this.orderStatus = page.locator('[class="status-list__status status-list__status_active"]')
  }
}
