class RegInfo {
    async RegInfo({ page }) {
        await page.locator("input[name='firstName']").type('Mariia')
        await page.locator("input[name='lastName']").type('Korol')
        await page.locator("input[name='address']").type('Instytutska51')
        await page.locator("input[name='city']").type('Gatne')
        await page.locator("input[name='state']").type('Kyiv')
        await page.locator("input[name='zip']").type('1111')
        await page.locator("input[name='country']").type('Ukraine')
        await page.locator('button').click()
    }
}

module.exports = { RegInfo }
