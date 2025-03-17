import { test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'

let authPage: LoginPage

test.beforeEach(async ({ page }) => {
  authPage = new LoginPage(page)
  await authPage.open()
})

test('signIn button disabled when incorrect data inserted', async ({}) => {
  await authPage.usernameField.fill(faker.lorem.word(2))
  await authPage.passwordField.fill(faker.lorem.word(7))
  await authPage.signInButton.checkDisabled(true)
})

test('error message displayed when incorrect credentials used', async ({}) => {
  await authPage.usernameField.fill(faker.internet.username())
  await authPage.passwordField.fill(faker.internet.password())
  await authPage.signInButton.click()
  await authPage.popupDialog.toHaveTitle('Incorrect credentials')
})

test('login with correct credentials and verify order creation page', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.statusButton.checkVisible()
  await orderCreationPage.statusButton.checkDisabled(false)
  await orderCreationPage.nameField.checkVisible()
  await orderCreationPage.phoneField.checkVisible()
  await orderCreationPage.commentField.checkVisible()
  await orderCreationPage.createOrderButton.checkVisible()
})

test('login and create order', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.nameField.fill(faker.person.fullName())
  await orderCreationPage.phoneField.fill(faker.phone.number())
  await orderCreationPage.commentField.fill(faker.word.words(1))
  await orderCreationPage.createOrderButton.click()
  await orderCreationPage.statusModal.toHaveTitle('Order has been created!')
})
