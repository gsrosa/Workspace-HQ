import { test, expect } from '@playwright/test';

test.describe('TDD-3: Protected route enforcement', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Try to access a protected route without being logged in
    await page.goto('/dashboard');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('should allow authenticated user to access protected routes', async ({ page }) => {
    // First, create and login a user
    const email = `protected-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Protected Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });
    
    // Now try to access protected route
    await page.goto('/dashboard');
    
    // Should be able to access (not redirected to login)
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  });

  test('should protect multiple routes', async ({ page }) => {
    // Try accessing different protected routes
    const protectedRoutes = ['/dashboard', '/orgs/new'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    }
  });
});

