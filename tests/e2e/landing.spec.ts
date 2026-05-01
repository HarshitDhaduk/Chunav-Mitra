import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');

    // Next-intl redirects to /en automatically if no locale is in path
    await page.waitForURL(/\/(en|hi|gu)/);
    
    // Check page title or a prominent element
    await expect(page).toHaveTitle(/Chunav Mitra/);
  });
});
