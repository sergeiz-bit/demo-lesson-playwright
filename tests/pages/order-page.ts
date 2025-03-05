import { Page } from '@playwright/test'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { BasePage } from './base-page'
import { Popup } from '../molecules/Popup'
import { faker } from '@faker-js/faker/dist/locale/ar'

export class OrderPage extends BasePage {
  readonly statusButton: Button
  readonly orderButton: Button
  readonly nameField: Input
  readonly phoneField: Input
  readonly commentField: Input
  readonly statusModal: Popup;
  readonly orderNumberField: Input;
  readonly trackButton: Button;


  constructor(page: Page) {
    super(page)
    this.statusButton = new Button(page, '[data-name="openStatusPopup-button"]')
    this.nameField = new Input(page, '#name')
    this.phoneField = new Input(page, '#phone')
    this.commentField = new Input(page, '#comment')
    this.orderButton = new Button(page, '[data-name="createOrder-button"]')
    this.statusModal = new Popup(page, 'searchOrder-popup')
    this.orderNumberField = new Input(page, '[data-name="searchOrder-popup"] input')
    this.trackButton = new Button(page, '[data-name="searchOrder-popup"] button.order-search-popup__button')
  }

  async createOrder(): Promise<void>{
    await this.nameField.fill(faker.person.fullName())
    await this.phoneField.fill(faker.phone.number())
    await this.commentField.fill(faker.word.words(1));
    await this.orderButton.click();

  }

  async trackOrderStatus(orderNumber: string):Promise<void>{
    await this.orderNumberField.fill(orderNumber);
    await this.trackButton.click();
  }

}
