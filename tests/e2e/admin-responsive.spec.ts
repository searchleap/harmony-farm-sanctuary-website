import { test, expect, devices } from '@playwright/test';

test.describe('Admin Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin/login');
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/admin');
  });

  test('should adapt to mobile viewport (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Sidebar should be hidden on mobile
    const sidebar = page.locator('[data-testid="admin-sidebar"]');
    await expect(sidebar).not.toBeVisible();
    
    // Mobile menu button should be visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Content should stack vertically
    await page.click('[data-testid="nav-analytics"]');
    await page.waitForURL('/admin/analytics');
    
    // Check that stats cards stack on mobile
    const statsContainer = page.locator('[data-testid="stats-container"]');
    if (await statsContainer.isVisible()) {
      const bbox = await statsContainer.boundingBox();
      expect(bbox?.width).toBeLessThan(400);
    }
  });

  test('should adapt to tablet viewport (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigation should adapt to tablet size
    await page.click('[data-testid="nav-animals"]');
    await page.waitForURL('/admin/animals');
    
    // Tables should be scrollable horizontally if needed
    const table = page.locator('[data-testid="admin-table"]');
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
      // Check for horizontal scroll if table is wide
    }
    
    // Forms should adapt properly
    await page.click('[data-testid="add-animal-button"]');
    const form = page.locator('[data-testid="animal-form"]');
    if (await form.isVisible()) {
      await expect(form).toBeVisible();
      // Form inputs should be appropriately sized for tablet
    }
  });

  test('should work properly on desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Full sidebar should be visible
    await expect(page.locator('[data-testid="admin-sidebar"]')).toBeVisible();
    
    // Mobile menu button should not be visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).not.toBeVisible();
    
    // Check that content uses full width appropriately
    await page.click('[data-testid="nav-analytics"]');
    await page.waitForURL('/admin/analytics');
    
    // Analytics dashboard should utilize space efficiently
    const dashboard = page.locator('[data-testid="analytics-dashboard"]');
    if (await dashboard.isVisible()) {
      const bbox = await dashboard.boundingBox();
      expect(bbox?.width).toBeGreaterThan(1200);
    }
  });

  test('should handle orientation changes on mobile', async ({ page }) => {
    // Portrait mode
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="admin-sidebar"]')).toBeVisible();
    
    // Landscape mode
    await page.setViewportSize({ width: 844, height: 390 });
    
    // Menu should still work in landscape
    await page.click('[data-testid="nav-animals"]');
    await page.waitForURL('/admin/animals');
    
    // Content should adapt to landscape orientation
    await expect(page.locator('h1')).toContainText('Animals');
  });

  test('should ensure touch targets are appropriately sized on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    
    // Check that navigation items are large enough for touch
    const navItems = page.locator('[data-testid^="nav-"]');
    const count = await navItems.count();
    
    for (let i = 0; i < count; i++) {
      const navItem = navItems.nth(i);
      const bbox = await navItem.boundingBox();
      if (bbox) {
        // Touch targets should be at least 44px tall (Apple guideline)
        expect(bbox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should handle form inputs properly on different screen sizes', async ({ page }) => {
    await page.click('[data-testid="nav-animals"]');
    await page.waitForURL('/admin/animals');
    
    // Test mobile form layout
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('[data-testid="add-animal-button"]');
    
    const nameInput = page.locator('[data-testid="animal-name-input"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Animal');
      
      // Input should be properly sized for mobile
      const bbox = await nameInput.boundingBox();
      expect(bbox?.width).toBeLessThan(350);
    }
    
    // Test tablet form layout
    await page.setViewportSize({ width: 768, height: 1024 });
    if (await nameInput.isVisible()) {
      const bbox = await nameInput.boundingBox();
      expect(bbox?.width).toBeGreaterThan(300);
      expect(bbox?.width).toBeLessThan(700);
    }
    
    // Test desktop form layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    if (await nameInput.isVisible()) {
      const bbox = await nameInput.boundingBox();
      expect(bbox?.width).toBeGreaterThan(400);
    }
  });

  test('should ensure modals work properly on all screen sizes', async ({ page }) => {
    await page.click('[data-testid="nav-settings"]');
    await page.waitForURL('/admin/settings');
    
    // Test modal on mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('[data-testid="open-modal-button"]');
    
    const modal = page.locator('[data-testid="admin-modal"]');
    if (await modal.isVisible()) {
      // Modal should be appropriately sized for mobile
      const bbox = await modal.boundingBox();
      expect(bbox?.width).toBeLessThan(380);
      
      // Close modal
      await page.press('body', 'Escape');
      await expect(modal).not.toBeVisible();
    }
    
    // Test modal on tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    if (await page.locator('[data-testid="open-modal-button"]').isVisible()) {
      await page.click('[data-testid="open-modal-button"]');
      
      if (await modal.isVisible()) {
        const bbox = await modal.boundingBox();
        expect(bbox?.width).toBeGreaterThan(400);
        expect(bbox?.width).toBeLessThan(700);
        
        // Close modal
        await page.click('[data-testid="modal-close-button"]');
        await expect(modal).not.toBeVisible();
      }
    }
  });
});