import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layout').click()
})

test('Locator syntax rules', async ({page}) => {
    // by Tag Name
    await page.locator('input').first().click()

    // by ID
    page.locator('#inputEmail1')

    // by class value
    page.locator('.shape-rectangle')

    // by attribute name
    page.locator('[placeholder="Email"]')

    // by class value (full match)
    page.locator('[class=input-full-width size-medium status-basic shape-rectangle nb-transition]')

    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    // by xpath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async ({page}) => {

    // getByRole
    await page.getByRole('textbox', { name: 'Email' }).first().click()
    await page.getByRole('button', { name: 'Sign in'}).first().click()

    // getByLabel
    await page.getByLabel('Email').first().click()

    // getByPlaceholder
    await page.getByPlaceholder('Jane Doe').click()

    // getByText
    await page.getByText('Using the Grid').click()

    // getByTestId
    await page.getByTestId('SignIn').click()

    // getByTitle
    await page.getByTitle('IoT Dashboard').click()
})

test('locating child elements', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements', async ({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', { name: 'Email' }).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', { name: 'Email' }).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', { name: 'Email' }).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', { name: 'Password' }).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', { name: 'Email' }).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: 'Email' }).click()
})

test('Reusing the locators', async ({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailInput = basicForm.getByRole('textbox', { name: 'Email' })
    const passwordInput = basicForm.getByRole('textbox', { name: 'Password' })
    const signInButton = basicForm.getByRole('button')

    await emailInput.fill('test@test.com')
    await passwordInput.fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await signInButton.click()

    await expect(emailInput).toHaveValue('test@test.com')
})

test('extracting values', async ({page}) => {
    // single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText= await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain('Option 1')

    // input value
    const emailInput = basicForm.getByRole('textbox', { name: 'Email' })
    await emailInput.fill('test@test.com')
    const enteredEmail = await emailInput.inputValue()
    expect(enteredEmail).toEqual('test@test.com')

    // getting attribute value
    const placeHolderValue = await emailInput.getAttribute('placeholder')
    expect(placeHolderValue).toEqual('Email')
})

test('assertions', async ({page}) => {
     const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // general assertions
    const value = 5
    expect(value).toEqual(5)

    const textValue = await basicFormButton.textContent()
    expect(textValue).toEqual('Submit')

    // Locator assertions
    await expect(basicFormButton).toHaveText('Submit')

    // soft assertions
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})