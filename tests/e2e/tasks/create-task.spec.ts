import { test, expect } from '@playwright/test';

test.describe('TDD-7: Create Task with optimistic UI', () => {
  test('should create task with optimistic UI update', async ({ page }) => {
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

    // Create org
    await page.goto('/orgs/new');
    const orgName = `Test Org ${Date.now()}`;
    await page.fill('input[name="name"]', orgName);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Get orgId from URL
    const url = page.url();
    const orgId = url.match(/\/orgs\/([^/]+)/)?.[1];
    expect(orgId).toBeTruthy();

    // Create task
    const taskTitle = `Test Task ${Date.now()}`;
    const taskDescription = 'This is a test task description';

    // Click create task button (assuming there's a button to open the form)
    await page.click('button:has-text("New Task"), button:has-text("Create Task"), button[aria-label*="task" i]', { timeout: 5000 });

    // Fill task form
    await page.fill('input[name="title"], input[placeholder*="title" i]', taskTitle);
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', taskDescription);

    // Submit form
    await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');

    // Verify optimistic UI - task should appear immediately
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 2000 });

    // Verify task persists after server response (wait a bit for server roundtrip)
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  });
});
