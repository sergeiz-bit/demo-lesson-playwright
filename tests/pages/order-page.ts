import { expect, Locator, Page } from '@playwright/test'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { BasePage } from './base-page'
import { faker } from '@faker-js/faker/locale/en'

export class OrderPage extends BasePage {
  readonly statusButton: Button
  readonly createOrderButton: Button
  readonly nameField: Input
  readonly phoneField: Input
  readonly commentField: Input
  readonly searchOrderInput: Input
  readonly orderCreatedPopup: Locator
  readonly orderCreatedPopupOkButton: Button
  readonly notificationPopupText: Locator
  readonly notificationPopupTitle: Locator
  readonly trackingButton: Button

  constructor(page: Page) {
    super(page)
    this.statusButton = new Button(page, '[data-name="openStatusPopup-button"]')
    this.nameField = new Input(page, '#name')
    this.phoneField = new Input(page, '#phone')
    this.commentField = new Input(page, '#comment')
    this.createOrderButton = new Button(page, '[data-name="createOrder-button"]')
    this.searchOrderInput = new Input(page, '[data-name="searchOrder-popup"] input')
    this.orderCreatedPopup = page.locator('#orderSuccessfullyCreated-popup')
    this.orderCreatedPopupOkButton = new Button(
      page,
      '[data-name="orderSuccessfullyCreated-popup-ok-button"]',
    )
    this.notificationPopupText = page.locator('span.notification-popup__text')
    this.notificationPopupTitle = page.locator('h3.notification-popup__text')
    this.trackingButton = new Button(page, '[data-name="searchOrder-submitButton"]')
  }

  async createOrder(): Promise<void> {
    await this.nameField.fill(faker.person.fullName())
    await this.phoneField.fill(faker.phone.number())
    await this.commentField.fill(faker.word.words(1))
    await this.createOrderButton.click()
  }

  async trackOrderStatus(orderNumber: string): Promise<void> {
    await this.searchOrderInput.fill(orderNumber)
    await this.trackingButton.click()
  }

  async checkCreatedOrderID(id: number): Promise<void> {
    expect(await this.notificationPopupText.innerText()).toContain(`${id}`)
  }
}
