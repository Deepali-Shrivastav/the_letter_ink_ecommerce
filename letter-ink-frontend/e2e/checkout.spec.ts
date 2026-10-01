import { test, expect } from '@playwright/test';

test.describe('E-commerce Complete Flow Test', () => {
  
  test('1. Products & Variants (Handwritten Letters)', async ({ page }) => {
    await page.goto('/product/handwritten-letters');
    await expect(page.getByRole('heading', { name: /Handwritten Letters/i })).toBeVisible();
    
    // Select options
    await page.getByRole('button', { name: 'Black', exact: true }).click();
    await page.getByRole('button', { name: 'Yellowish', exact: true }).click();

    // Add to Cart
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // Verify Cart Sidebar is open and has the item
    const cartHeader = page.getByRole('heading', { name: 'Your Cart' });
    await expect(cartHeader).toBeVisible();
    await expect(page.getByText('Handwritten Letters').first()).toBeVisible();
  });

  test('2. Hampers', async ({ page }) => {
    await page.goto('/product/phool-ram-darbar-diwali-decor-giftbox-with-candle-spinner');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('button', { name: /Add to Cart/i }).click();
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  });

  test('3. Gifts', async ({ page }) => {
    await page.goto('/product/radiant-love-personalized-photo-glow-lamp');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('button', { name: /Add to Cart/i }).click();
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  });

  test('4. Workshops', async ({ page }) => {
    await page.goto('/workshops');
    await expect(page.getByRole('heading', { name: /Workshops/i }).first()).toBeVisible();
    // Click on a workshop enrollment card link if present
    const workshopLink = page.getByRole('link', { name: /Enroll|Reserve/i }).first();
    if (await workshopLink.isVisible()) {
        await workshopLink.click();
        await expect(page.getByRole('button', { name: /Add to Cart/i }).first()).toBeVisible();
    }
  });

  test('5. Campaigns', async ({ page }) => {
    await page.goto('/campaigns');
    // We expect campaigns to be available or return a 404
    await expect(page.getByRole('heading', { name: /Campaigns/i }).first()).toBeVisible();
  });

  test('6. Checkout & Payment Flow', async ({ page }) => {
    await page.goto('/product/handwritten-letters');
    await page.getByRole('button', { name: 'Black', exact: true }).click();
    await page.getByRole('button', { name: 'Yellowish', exact: true }).click();
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // Verify Cart Sidebar is open and has the Razorpay Checkout button
    const checkoutButton = page.getByRole('button', { name: /Checkout with Razorpay/i });
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();

    // Verify Razorpay payment opens directly from cart
    const simulateButton = page.getByRole('button', { name: /Simulate Success/i });
    if (await simulateButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await simulateButton.click();
      // Verify redirection to order success confirmation page
      await expect(page).toHaveURL(/.*order\/success/, { timeout: 10000 });
      await expect(page.getByRole('heading', { name: /Thank you for your order/i })).toBeVisible();
    }
  });

});
