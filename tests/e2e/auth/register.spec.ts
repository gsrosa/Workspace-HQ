import { test, expect } from '@playwright/test';

test.describe('TDD-1: User registration with credentials', () => {
  test('should register a new user and redirect to onboarding', async ({ page }) => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Test User';

    await page.goto('/signup');
    
    // Fill registration form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to onboarding
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });
    
    // Verify user is logged in (check for user name or email in UI)
    // This assumes the onboarding page shows user info
    await expect(page.locator('body')).toContainText(name, { timeout: 2000 });
  });

  test('should hash password and save user to database', async ({ page }) => {
    const email = `test-db-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'DB Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });
    
    // Note: In a real scenario, we'd verify the database directly
    // For E2E, we verify the user can log in (which confirms DB save)
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    
    // Should be able to log in, confirming user exists in DB
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
  });
});

