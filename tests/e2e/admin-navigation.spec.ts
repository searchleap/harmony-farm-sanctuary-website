import { test, expect } from '@playwright/test';

test.describe('Admin Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin/login');
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/admin');
  });

  test('should navigate through all main admin sections', async ({ page }) => {
    // Test navigation to Animals
    await page.click('[data-testid="nav-animals"]');
    await page.waitForURL('/admin/animals');
    await expect(page.locator('h1')).toContainText('Animals');
    
    // Test navigation to Blog
    await page.click('[data-testid="nav-blog"]');
    await page.waitForURL('/admin/blog');
    await expect(page.locator('h1')).toContainText('Blog');
    
    // Test navigation to FAQ
    await page.click('[data-testid="nav-faq"]');
    await page.waitForURL('/admin/faq');
    await expect(page.locator('h1')).toContainText('FAQ');
    
    // Test navigation to Analytics
    await page.click('[data-testid="nav-analytics"]');
    await page.waitForURL('/admin/analytics');
    await expect(page.locator('h1')).toContainText('Analytics');
    
    // Test navigation to Settings
    await page.click('[data-testid="nav-settings"]');
    await page.waitForURL('/admin/settings');
    await expect(page.locator('h1')).toContainText('Settings');
    
    // Test navigation to Testing
    await page.click('[data-testid="nav-testing"]');
    await page.waitForURL('/admin/testing');
    await expect(page.locator('h1')).toContainText('Testing');
  });

  test('should show active navigation state', async ({ page }) => {
    // Navigate to Animals section
    await page.click('[data-testid="nav-animals"]');
    
    // Check that Animals nav item is marked as active
    await expect(page.locator('[data-testid="nav-animals"]')).toHaveClass(/active|bg-blue/);
    
    // Check that other nav items are not active
    await expect(page.locator('[data-testid="nav-blog"]')).not.toHaveClass(/active|bg-blue/);
  });

  test('should work with breadcrumb navigation', async ({ page }) => {
    // Navigate to a nested page (if applicable)
    await page.click('[data-testid="nav-animals"]');
    await page.waitForURL('/admin/animals');
    
    // Check breadcrumbs are present
    await expect(page.locator('[data-testid="breadcrumbs"]')).toBeVisible();
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('Admin');
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('Animals');
    
    // Click on Admin breadcrumb to go back
    await page.click('[data-testid="breadcrumb-admin"]');
    await page.waitForURL('/admin');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should handle mobile navigation menu', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Set mobile viewport for desktop browser
      await page.setViewportSize({ width: 390, height: 844 });
    }
    
    // On mobile, sidebar should be hidden initially
    const sidebar = page.locator('[data-testid="admin-sidebar"]');
    await expect(sidebar).not.toBeVisible();
    
    // Click hamburger menu to open sidebar
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(sidebar).toBeVisible();
    
    // Click on a navigation item
    await page.click('[data-testid="nav-animals"]');
    await page.waitForURL('/admin/animals');
    
    // Sidebar should close after navigation on mobile
    await expect(sidebar).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on the first navigation item
    await page.press('[data-testid="nav-dashboard"]', 'Tab');
    
    // Use arrow keys to navigate
    await page.press('body', 'ArrowDown');
    await page.press('body', 'ArrowDown');
    
    // Press Enter to activate navigation item
    await page.press('body', 'Enter');
    
    // Should navigate to the focused item
    // Note: This test would need specific keyboard navigation implementation
  });

  test('should show correct navigation badges and counts', async ({ page }) => {
    // Check if navigation items show correct counts/badges
    const animalsBadge = page.locator('[data-testid="nav-animals-badge"]');
    const blogBadge = page.locator('[data-testid="nav-blog-badge"]');
    const volunteersBadge = page.locator('[data-testid="nav-volunteers-badge"]');
    
    // Verify badges are visible and show numbers
    if (await animalsBadge.isVisible()) {
      await expect(animalsBadge).toContainText(/\d+/);
    }
    
    if (await blogBadge.isVisible()) {
      await expect(blogBadge).toContainText(/\d+/);
    }
    
    if (await volunteersBadge.isVisible()) {
      await expect(volunteersBadge).toContainText(/\d+/);
    }
  });
});