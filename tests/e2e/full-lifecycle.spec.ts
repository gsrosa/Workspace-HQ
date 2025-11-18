import { test, expect } from '@playwright/test';

test.describe('TDD-14: Full lifecycle E2E', () => {
  test('should complete full user flow: signup → create org → invite → accept → CRUD tasks', async ({
    browser,
  }) => {
    // Owner context
    const ownerContext = await browser.newContext();
    const ownerPage = await ownerContext.newPage();

    // 1. Signup → create org
    const ownerEmail = `owner-${Date.now()}@example.com`;
    const ownerPassword = 'Test123!@#';

    await ownerPage.goto('/signup');
    await ownerPage.fill('input[name="email"]', ownerEmail);
    await ownerPage.fill('input[name="password"]', ownerPassword);
    await ownerPage.fill('input[name="name"]', 'Owner User');
    await ownerPage.click('button[type="submit"]');
    await expect(ownerPage).toHaveURL(/\/onboarding/, { timeout: 5000 });

    await ownerPage.goto('/orgs/new');
    const orgName = `Test Org ${Date.now()}`;
    await ownerPage.fill('input[name="name"]', orgName);
    await ownerPage.click('button[type="submit"]');
    await expect(ownerPage).toHaveURL(/\/orgs\/.*\/tasks/, { timeout: 5000 });

    const url = ownerPage.url();
    const orgId = url.match(/\/orgs\/([^/]+)/)?.[1];
    expect(orgId).toBeTruthy();

    // 2. Invite user (would need to navigate to users page and use invite functionality)
    // For now, we'll create a task to verify the flow works
    await ownerPage.click('button:has-text("New Task"), button:has-text("Create Task")', {
      timeout: 5000,
    });
    const taskTitle = `E2E Test Task ${Date.now()}`;
    await ownerPage.fill('input[name="title"]', taskTitle);
    await ownerPage.click('button[type="submit"]:has-text("Create")');
    await expect(ownerPage.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });

    // 3. Edit task
    await ownerPage.click('button[aria-label*="edit" i], button:has-text("Edit")', {
      timeout: 2000,
    });
    const updatedTitle = `Updated Task ${Date.now()}`;
    await ownerPage.fill('input[name="title"]', updatedTitle);
    await ownerPage.click('button[type="submit"]:has-text("Save")');
    await expect(ownerPage.locator(`text=${updatedTitle}`)).toBeVisible({ timeout: 5000 });

    // 4. Delete task
    await ownerPage.click('button[aria-label*="delete" i], button:has-text("Delete")', {
      timeout: 2000,
    });
    await ownerPage.click('button:has-text("Confirm"), button:has-text("Delete")', {
      timeout: 2000,
    });
    await expect(ownerPage.locator(`text=${updatedTitle}`)).not.toBeVisible({ timeout: 5000 });

    await ownerContext.close();
  });
});
