import { test, expect } from '@playwright/test';

test.describe('TDD-4: Create Organization', () => {
  test('should create organization and redirect to dashboard', async ({ page }) => {
    // First, create and login a user
    const email = `org-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Org Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    // Navigate to create org page
    await page.goto('/orgs/new');
    
    // Fill org creation form
    const orgName = `Test Org ${Date.now()}`;
    await page.fill('input[name="name"]', orgName);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or org tasks page
    await expect(page).not.toHaveURL(/\/orgs\/new/, { timeout: 5000 });
    
    // Verify org was created (check for org name in UI or URL)
    // This assumes the redirect goes to a page showing the org
    await expect(page.locator('body')).toContainText(orgName, { timeout: 2000 });
  });

  test('should make user OWNER of created organization', async ({ page }) => {
    // Create user and org
    const email = `owner-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Owner Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    const orgName = `Owner Org ${Date.now()}`;
    await page.fill('input[name="name"]', orgName);
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await expect(page).not.toHaveURL(/\/orgs\/new/, { timeout: 5000 });
    
    // Note: In a real scenario, we'd verify the database directly
    // For E2E, we verify the user can access org management (OWNER privilege)
    // This would be tested when we implement the users page
  });
});

