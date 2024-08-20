/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
const { RegInfo } = require('../UtilsReg/RegInfo')
const registrePage = new RegInfo()

test.describe('test task', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        expect(page.getByText('Checkout')).toBeVisible()
    })

    // Tasks
    // Prepare tests for checking that:
    //
    // 1) zip code doesn't accept text
    // 2) user cannot proceed empty payment form, any other validations shouldn't be checked
    // 3) check order total counting

    test('zip code doesnt accept text', async ({ page }) => {
        await page.locator("input[name='zip']").type('qwerty')
        await expect(page.locator("input[name='zip']")).toBeEmpty()
    })

    test('Payment form', async ({ page }) => {
        await registrePage.RegInfo({ page })
        await page.locator("//button[normalize-space()='Next']").click()

        const test = await page.locator('//p[text()="This field is required"]')
        console.log(await test.allTextContents())
        expect(await test.count()).toEqual(4)
    })

    test('order total counting', async ({ page }) => {
        await registrePage.RegInfo({ page })
        await page.locator('div input[name="cardName"]').type('Mariia Korol')
        await page
            .locator('div input[name="cardNumber"]')
            .type('1111111111111111')
        await page.locator('div input[name="expDate"]').fill('2026-07')
        await page.locator('div input[name="cvv"]').fill('222')
        await page.locator('div input[name="saveCard"]').click()
        await page.locator('//button[text()="Next"]').click()

        const itemPrice = await page
            .locator('//p[text()="$ "]')
            .allTextContents()
        console.log(await itemPrice) //  [ '$ 9.99', '$ 3.45', '$ 6.51', '$ 14.11', '$ 0.00' ]

        const totalPrice = await page.locator('//h6[text()="$ "]').textContent()
        if (totalPrice === null) {
            throw new Error('Total price not found on the page')
        }
        let totalNumber = parseFloat(totalPrice.replace('$ ', ''))

        console.log(totalPrice)

        let sum = 0
        for (let i = 0; i < itemPrice.length; i++) {
            let result = itemPrice[i].replace('$ ', '')
            let priceNumber = parseFloat(result)
            //console.log(result)
            sum = sum + priceNumber
        }
        console.log(sum)
        expect(sum).toEqual(totalNumber)
    })
})
