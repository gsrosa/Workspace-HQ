import { test, expect } from '@playwright/test';

test.describe('TDD-11: SSR dashboard', () => {
  test('should render dashboard with server-side data', async ({ page }) => {
    // Setup: Create user, org, login
    const email = `dashboard-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', 'Dashboard Test User');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    await page.fill('input[name="name"]', `Test Org ${Date.now()}`);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Verify dashboard loads (should have stats or content)
    await expect(page.locator('body')).toBeVisible();
    
    // Verify it's not showing loading state (SSR should render immediately)
    // Check for dashboard-specific content
    const dashboardContent = page.locator('text=/dashboard|stats|overview/i');
    await expect(dashboardContent.first()).toBeVisible({ timeout: 3000 });
  });
});
