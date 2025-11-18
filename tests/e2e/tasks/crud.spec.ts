import { test, expect } from '@playwright/test';

test.describe('TDD-8: Update/Delete Task', () => {
  test('should update task', async ({ page }) => {
    // Setup: Create user, org, login, and a task
    const email = `update-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', 'Update Test User');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    await page.fill('input[name="name"]', `Test Org ${Date.now()}`);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Create a task first
    const originalTitle = `Original Task ${Date.now()}`;
    await page.click('button:has-text("New Task"), button:has-text("Create Task")', { timeout: 5000 });
    await page.fill('input[name="title"]', originalTitle);
    await page.click('button[type="submit"]:has-text("Create")');
    await expect(page.locator(`text=${originalTitle}`)).toBeVisible({ timeout: 5000 });

    // Update the task
    const updatedTitle = `Updated Task ${Date.now()}`;
    await page.click(`button[aria-label*="edit" i], button[aria-label*="Edit"]`, { timeout: 2000 });
    await page.fill('input[name="title"]', updatedTitle);
    await page.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');

    // Verify update
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${originalTitle}`)).not.toBeVisible();
  });

  test('should delete task', async ({ page }) => {
    // Setup: Create user, org, login, and a task
    const email = `delete-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', 'Delete Test User');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    await page.fill('input[name="name"]', `Test Org ${Date.now()}`);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Create a task
    const taskTitle = `Task to Delete ${Date.now()}`;
    await page.click('button:has-text("New Task"), button:has-text("Create Task")', { timeout: 5000 });
    await page.fill('input[name="title"]', taskTitle);
    await page.click('button[type="submit"]:has-text("Create")');
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });

    // Delete the task
    await page.click(`button[aria-label*="delete" i], button[aria-label*="Delete"]`, { timeout: 2000 });
    await page.click('button:has-text("Confirm"), button:has-text("Delete")', { timeout: 2000 });

    // Verify deletion
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible({ timeout: 5000 });
  });
});
