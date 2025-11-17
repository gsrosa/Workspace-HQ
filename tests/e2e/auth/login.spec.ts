import { test, expect } from '@playwright/test';

test.describe('TDD-2: User login', () => {
  test('should login with valid credentials', async ({ page }) => {
    // First, create a user via signup
    const email = `login-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Login Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });
    
    // Now logout (if there's a logout button) or go to login
    await page.goto('/login');
    
    // Login with the same credentials
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    
    // Should redirect away from login page
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
    
    // Should be authenticated (check for protected content)
    await expect(page.locator('body')).toContainText(name, { timeout: 2000 });
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    
    // Should show error and stay on login page
    await expect(page).toHaveURL(/\/login/, { timeout: 3000 });
    // Check for error message
    await expect(page.locator('body')).toContainText(/invalid|error|incorrect/i, { timeout: 2000 });
  });
});

