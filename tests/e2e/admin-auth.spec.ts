import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session data
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    // Navigate to admin login
    await page.goto('/admin/login');
    
    // Verify we're on the login page
    await expect(page.locator('h1')).toContainText('Admin Login');
    
    // Fill in login form
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Wait for navigation to admin dashboard
    await page.waitForURL('/admin');
    
    // Verify we're logged in
    await expect(page.locator('[data-testid="user-menu"]')).toContainText('Admin User');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Try to login with invalid credentials
    await page.fill('[data-testid="username-input"]', 'invalid');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    // Should stay on login page and show error
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
    
    // Should still be on login page
    await expect(page).toHaveURL('/admin/login');
  });

  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access admin animals page without authentication
    await page.goto('/admin/animals');
    
    // Should be redirected to login
    await page.waitForURL('/admin/login');
    await expect(page.locator('h1')).toContainText('Admin Login');
  });

  test('should successfully log out', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/admin');
    
    // Open user menu and logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // Should be redirected to login page
    await page.waitForURL('/admin/login');
    await expect(page.locator('h1')).toContainText('Admin Login');
  });

  test('should remember login redirect after authentication', async ({ page }) => {
    // Try to access specific admin page
    await page.goto('/admin/settings');
    
    // Should be redirected to login
    await page.waitForURL('/admin/login');
    
    // Login
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    // Should be redirected back to originally requested page
    await page.waitForURL('/admin/settings');
    await expect(page.locator('h1')).toContainText('Settings');
  });
});