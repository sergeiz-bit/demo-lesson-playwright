import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { OrderNotFoundPage } from '../pages/order-not-found'

test('signIn button disabled when incorrect data inserted', async ({ page }) => {
  const authPage = new LoginPage(page)
  await authPage.open()
  await authPage.usernameField.fill(faker.lorem.word(2))
  await authPage.passwordField.fill(faker.lorem.word(7))
  await authPage.signInButton.checkDisabled(true)
})

test('login with correct credentials and verify order creation page', async ({ page }) => {
  const authPage = new LoginPage(page)
  await authPage.open()
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.statusButton.checkDisabled(false)
  await orderCreationPage.nameField.checkVisible()
  await orderCreationPage.phoneField.checkVisible()
  await orderCreationPage.commentField.checkVisible()
  await orderCreationPage.createOrderButton.checkVisible()
})

test('TL-18-1 Check footer on login page', async ({ page }) => {
  const authPage = new LoginPage(page)
  await authPage.open()
  await authPage.checkFooterAttached()
  await authPage.langButtonRu.checkVisible()
  await authPage.langButtonEn.checkVisible()
  await authPage.privacyPolicyLink.checkVisible()
  await authPage.cookiePolicyLink.checkVisible()
  await authPage.tosLink.checkVisible()
})

test('TL-18-2 Check footer on order page', async ({ page }) => {
  const authPage = new LoginPage(page)
  await authPage.open()
  const orderPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderPage.langButtonRu.checkVisible()
  await orderPage.langButtonEn.checkVisible()
  await orderPage.privacyPolicyLink.checkVisible()
  await orderPage.cookiePolicyLink.checkVisible()
  await orderPage.tosLink.checkVisible()
})

test('TL-18-3 Check footer on order not found page', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const notFoundPage = new OrderNotFoundPage(page)
  await loginPage.open()
  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderPage.statusButton.click()
  await orderPage.searchOrderInput.fill('12341234')
  await orderPage.trackButton.click()
  await notFoundPage.checkNotFoundTitle()
  await notFoundPage.checkFooterAttached()
  await notFoundPage.langButtonRu.checkVisible()
  await notFoundPage.langButtonEn.checkVisible()
  await notFoundPage.privacyPolicyLink.checkVisible()
  await notFoundPage.cookiePolicyLink.checkVisible()
  await notFoundPage.tosLink.checkVisible()
})

test('TL-18-4 Check footer on order not found page', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderPage.createOrder()
  await orderPage.statusButton.click()
  await orderPage.trackOrderStatus('123123')
})

test('TL-22-1 Mocked auth', async ({ page }) => {
  const authPage = new LoginPage(page)
  await authPage.open()
  await page.route('**/login/student', async (route) => {
    const responseBody = 'test.test.test'
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: responseBody,
    })
  })

  const orderPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderPage.statusButton.checkDisabled(false)
  await orderPage.nameField.checkVisible()
})

test('TL-22-2 Mocked auth + order creation', async ({ page }) => {
  const name = 'qertrtywyy'
  const phone = 'sdfdafgsdfgsdfg'
  const comment = 'zxcvcxzvvczb'
  const orderId = 6010

  const authPage = new LoginPage(page)
  await authPage.open()
  await page.route('**/login/student', async (route) => {
    const responseBody = 'test.test.test'
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: responseBody,
    })
  })

  const orderPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderPage.statusButton.checkDisabled(false)
  await orderPage.nameField.checkVisible()
  await orderPage.nameField.fill(name)
  await orderPage.phoneField.fill(phone)
  await orderPage.commentField.fill(comment)
  await orderPage.createOrderButton.checkDisabled(false)
  await page.route('**/orders', async (route) => {
    const method = route.request().method()
    switch (method) {
      case 'POST': {
        const responseBody = {
          status: 'OPEN',
          courierId: null,
          customerName: name,
          customerPhone: phone,
          comment: comment,
          id: orderId,
        }
        return await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(responseBody),
        })
      }
      case 'GET': {
        const responseBody = {
          status: 'OPEN',
          courierId: null,
          customerName: name,
          customerPhone: phone,
          comment: comment,
          id: orderId,
        }
        return await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(responseBody),
        })
      }
      default: {
        return await route.continue()
      }
    }
  })
  const createOrderResponse = page.waitForResponse(
    (response) => response.url().includes('orders') && response.request().method() === 'POST',
  )
  await orderPage.createOrderButton.click()
  await createOrderResponse
  await orderPage.checkCreatedOrderID(orderId)
  await orderPage.orderCreatedModalOkButton.click()
  await orderPage.statusButton.click()
  await orderPage.searchOrderInput.fill(`${orderId}`)
  const searchOrderResponse = page.waitForResponse(
    (response) => response.url().includes('orders') && response.request().method() === 'GET',
  )
  await orderPage.trackingButton.click()
  await searchOrderResponse
  expect(page.url().includes(`${orderId}`)).toBeTruthy()
})
