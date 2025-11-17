import { test, expect } from '@playwright/test';

test.describe('TDD-8: Update/Delete Task', () => {
  test('should update task', async ({ page }) => {
    // Setup: Create user, org, login
    const email = `update-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Update Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    const orgName = `Update Org ${Date.now()}`;
    await page.fill('input[name="name"]', orgName);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Create task first
    const taskTitle = `Original Task ${Date.now()}`;
    await page.click('button:has-text("New Task")');
    await page.fill('input[name="title"]', taskTitle);
    await page.click('button:has-text("Create")');
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });

    // Update task
    const updatedTitle = `Updated Task ${Date.now()}`;
    await page.click(`button[aria-label*="Edit"][aria-label*="${taskTitle}"]`);
    await page.fill('input[name="title"]', updatedTitle);
    await page.click('button:has-text("Save")');
    
    // Should show updated title
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });

  test('should delete task', async ({ page }) => {
    // Setup: Create user, org, login
    const email = `delete-test-${Date.now()}@example.com`;
    const password = 'Test123!@#';
    const name = 'Delete Test User';

    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="name"]', name);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await page.goto('/orgs/new');
    const orgName = `Delete Org ${Date.now()}`;
    await page.fill('input[name="name"]', orgName);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    // Create task first
    const taskTitle = `Task to Delete ${Date.now()}`;
    await page.click('button:has-text("New Task")');
    await page.fill('input[name="title"]', taskTitle);
    await page.click('button:has-text("Create")');
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });

    // Delete task
    await page.click(`button[aria-label*="Delete"][aria-label*="${taskTitle}"]`);
    await page.click('button:has-text("Confirm")');
    
    // Should remove task from list
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible({ timeout: 5000 });
  });
});

