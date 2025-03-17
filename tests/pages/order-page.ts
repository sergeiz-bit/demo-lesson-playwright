import { expect, Locator, Page } from '@playwright/test'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { BasePage } from './base-page'
import { Popup } from '../organisms/Popup'
import { faker } from '@faker-js/faker/locale/en'

export class OrderPage extends BasePage {
  readonly statusButton: Button
  readonly createOrderButton: Button
  readonly nameField: Input
  readonly phoneField: Input
  readonly commentField: Input
  readonly statusModal: Popup
  readonly searchOrderInput: Input
  readonly trackButton: Button
  readonly orderCreatedModal: Popup
  readonly orderCreatedModalOkButton: Button
  readonly trackingButton: Button
  readonly notificationPopupText: Locator

  constructor(page: Page) {
    super(page)
    this.statusButton = new Button(page, '[data-name="openStatusPopup-button"]')
    this.nameField = new Input(page, '#name')
    this.phoneField = new Input(page, '#phone')
    this.commentField = new Input(page, '#comment')
    this.createOrderButton = new Button(page, '[data-name="createOrder-button"]')
    this.statusModal = new Popup(page, 'searchOrder-popup')
    this.searchOrderInput = new Input(page, '[data-name="searchOrder-popup"] input')
    this.trackButton = new Button(
      page,
      '[data-name="searchOrder-popup"] button.order-search-popup__button',
    )
    this.orderCreatedModal = new Popup(page, '#orderSuccessfullyCreated-popup')
    this.orderCreatedModalOkButton = new Button(
      page,
      '[data-name="orderSuccessfullyCreated-popup-ok-button"]',
    )
    this.trackingButton = new Button(page, '[data-name="searchOrder-submitButton"]')
    this.notificationPopupText = page.locator('span.notification-popup__text')
  }

  async createOrder(): Promise<void> {
    await this.nameField.fill(faker.person.fullName())

    await this.phoneField.fill(faker.phone.number())
    await this.commentField.fill(faker.word.words(1))
    await this.createOrderButton.click()
  }

  async trackOrderStatus(orderNumber: string): Promise<void> {
    await this.searchOrderInput.fill(orderNumber)
    await this.trackButton.click()
  }

  async checkCreatedOrderID(id: number): Promise<void> {
    expect(await this.notificationPopupText.innerText()).toContain(`${id}`)
  }
}
