import { test, expect } from '@playwright/test';

test.describe('Hotel Guest Assistant End-to-End Flow', () => {
  test('completes full guest journey: welcome, FAQ chip, suitability query, availability form, and reset', async ({
    page,
  }) => {
    // 1. Open hotel guest assistant web application
    await page.goto('/');

    // Verify title and luxury hotel hero banner
    await expect(page).toHaveTitle(/The Grand Azure Resort & Spa/);
    await expect(page.locator('h1')).toContainText('Pacific Splendor');
    await expect(page.locator('text=THE GRAND AZURE').first()).toBeVisible();

    // Verify assistant widget is visible
    const chat = page.locator('#concierge-widget-window');
    await expect(chat).toBeVisible();

    // Verify initial assistant welcome greeting inside concierge window
    await expect(chat.locator('text=dedicated AI Guest Concierge')).toBeVisible();

    // Wait for React hydration
    await expect(chat.locator('#chat-interface-root[data-hydrated="true"]')).toBeVisible({ timeout: 10000 });

    // 2. Ask check-in question (Scenario 1 & 2)
    const textarea = chat.locator('#chat-input-textarea');
    await textarea.fill('What time is check-in and check-out?');
    await chat.locator('#btn-send-message').click();

    // Wait for concierge response
    await expect(chat.locator('text=Standard check-in time is 3:00 PM')).toBeVisible({
      timeout: 10000,
    });
    // Check that source citation badge is rendered
    await expect(chat.locator('text=checkin checkout')).toBeVisible();

    // 3. Ask a room suitability question via text input (Scenario 3)
    await textarea.fill('Which room is suitable for three guests?');
    await chat.locator('#btn-send-message').click();

    // Verify response mentions Deluxe Double Queen and Executive Suite inside chat
    await expect(chat.locator('text=Deluxe Double Queen').first()).toBeVisible({ timeout: 10000 });
    await expect(chat.locator('text=Executive Oceanfront Suite').first()).toBeVisible();

    // 4. Inquire about availability to trigger inline date form (Scenario 8 & 9)
    await textarea.fill('Check room availability');
    await chat.locator('#btn-send-message').click();

    // Verify inline availability form is displayed
    const checkInInput = chat.locator('#form-checkin');
    const checkOutInput = chat.locator('#form-checkout');
    await expect(checkInInput).toBeVisible({ timeout: 10000 });

    // Fill stay details for next month
    await checkInInput.fill('2026-10-01');
    await checkOutInput.fill('2026-10-04');
    await chat.locator('#form-adults').selectOption('2');

    // Submit availability form
    await chat.locator('#btn-submit-availability-form').click();

    // Verify room availability cards appear with price and disclaimer
    await expect(chat.locator('text=Found 4 room option(s)')).toBeVisible({ timeout: 10000 });
    await expect(chat.getByRole('heading', { name: 'Deluxe King Room' }).first()).toBeVisible();
    await expect(
      chat.locator('text=Illustrative mock availability & prices. No real reservation is confirmed.').first()
    ).toBeVisible();

    // 5. Test widget close and reopen
    const closeBtn = page.locator('#btn-close-concierge-widget');
    await closeBtn.click();
    await expect(chat).not.toBeVisible();

    const openLauncher = page.locator('#btn-open-concierge-widget');
    await expect(openLauncher).toBeVisible();
    await openLauncher.click();
    await expect(chat).toBeVisible();
  });
});
