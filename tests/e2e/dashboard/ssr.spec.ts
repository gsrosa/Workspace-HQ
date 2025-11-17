import { test, expect } from '@playwright/test';

test.describe('TDD-11: SSR dashboard', () => {
  test('should render dashboard with server-side data', async ({ page }) => {
    // Setup: Create user, org, login
    const email = `dashboard-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Dashboard Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    const orgName = `Dashboard Org ${Date.now()}`;
    await page.fill('input[name="name"]', orgName);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should load dashboard with stats (SSR)
    await expect(page.locator('h1, h2')).toContainText(/dashboard|stats|overview/i, { timeout: 5000 });
    
    // Should show organization stats (server-rendered)
    await expect(page.locator('body')).toContainText(/tasks|members|organizations/i, { timeout: 3000 });
  });
});

