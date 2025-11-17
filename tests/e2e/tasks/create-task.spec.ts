import { test, expect } from '@playwright/test';

test.describe('TDD-7: Create Task with optimistic UI', () => {
  test('should create task and show optimistic update', async ({ page }) => {
    // Setup: Create user, org, and login
    const email = `task-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Task Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    const orgName = `Task Org ${Date.now()}`;
    await page.fill('input[name="name"]', orgName);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Get orgId from URL
    const url = page.url();
    const orgId = url.match(/\/orgs\/([^/]+)/)?.[1];
    expect(orgId).toBeTruthy();

    // Create task
    const taskTitle = `Test Task ${Date.now()}`;
    await page.click('button:has-text("New Task")');
    await page.fill('input[name="title"]', taskTitle);
    await page.fill('textarea[name="description"]', 'Test description');
    await page.click('button:has-text("Create")');

    // Should show task immediately (optimistic update)
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 2000 });

    // Wait for server confirmation
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });
  });
});

