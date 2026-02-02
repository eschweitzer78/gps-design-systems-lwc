import { Page, Locator, expect } from '@playwright/test';

/**
 * Page helpers for sfGpsDsCaOn E2E tests
 */

/**
 * Wait for LWC component to be fully rendered
 */
export async function waitForLwcComponent(page: Page, componentName: string): Promise<void> {
  // Wait for the component element to be in DOM
  await page.waitForSelector(`c-${componentName}`, { state: 'attached' });
  
  // Wait for any loading states to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for Ontario DS component to be interactive
 */
export async function waitForOntarioComponent(page: Page, selector: string): Promise<Locator> {
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible' });
  return locator;
}

/**
 * Get element within shadow DOM
 * Note: Light DOM components (renderMode = "light") don't need this
 */
export async function getShadowElement(page: Page, hostSelector: string, shadowSelector: string): Promise<Locator> {
  return page.locator(`${hostSelector} >> ${shadowSelector}`);
}

/**
 * Check if element has Ontario DS class
 */
export async function hasOntarioClass(element: Locator, className: string): Promise<boolean> {
  const fullClassName = className.startsWith('ontario-') ? className : `ontario-${className}`;
  const classes = await element.getAttribute('class');
  return classes?.includes(fullClassName) ?? false;
}

/**
 * Verify ARIA attribute value
 */
export async function checkAriaAttribute(
  element: Locator, 
  attribute: string, 
  expectedValue: string
): Promise<void> {
  const attrName = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`;
  await expect(element).toHaveAttribute(attrName, expectedValue);
}

/**
 * Navigate via keyboard
 */
export async function keyboardNavigate(page: Page, keys: string[]): Promise<void> {
  for (const key of keys) {
    await page.keyboard.press(key);
    // Small delay for visual/state updates
    await page.waitForTimeout(100);
  }
}

/**
 * Focus and tab through elements
 */
export async function tabToElement(page: Page, targetSelector: string): Promise<void> {
  const maxTabs = 50;
  let tabs = 0;
  
  while (tabs < maxTabs) {
    await page.keyboard.press('Tab');
    tabs++;
    
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? {
        tagName: el.tagName,
        id: el.id,
        className: el.className
      } : null;
    });
    
    if (focused) {
      const isTarget = await page.locator(targetSelector).evaluate((el, f) => {
        return document.activeElement === el;
      });
      
      if (isTarget) return;
    }
  }
  
  throw new Error(`Could not tab to element: ${targetSelector}`);
}

/**
 * Get live region announcements
 */
export async function getLiveRegionText(page: Page): Promise<string> {
  const liveRegion = page.locator('[aria-live]');
  await liveRegion.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
  return await liveRegion.textContent() || '';
}

/**
 * Check focus is within container
 */
export async function isFocusWithin(page: Page, containerSelector: string): Promise<boolean> {
  return await page.evaluate((selector) => {
    const container = document.querySelector(selector);
    if (!container) return false;
    return container.contains(document.activeElement);
  }, containerSelector);
}

/**
 * Dismiss modal if present
 */
export async function dismissModalIfPresent(page: Page): Promise<void> {
  const modal = page.locator('.ontario-modal, [role="dialog"]');
  const isVisible = await modal.isVisible().catch(() => false);
  
  if (isVisible) {
    await page.keyboard.press('Escape');
    await modal.waitFor({ state: 'hidden', timeout: 5000 });
  }
}

/**
 * Wait for ESRI map to load
 */
export async function waitForMapLoad(page: Page, timeout = 30000): Promise<void> {
  // Wait for the iframe containing the map
  const mapFrame = page.frameLocator('iframe[src*="visualforce"]');
  
  // Wait for map container to be visible
  await mapFrame.locator('.esri-view, .esri-map-container, #map').waitFor({ 
    state: 'visible',
    timeout 
  });
  
  // Wait for map to be interactive (tiles loaded)
  await page.waitForTimeout(2000); // Allow tiles to render
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Type with delay (for typeahead/debounce testing)
 */
export async function typeWithDelay(
  locator: Locator, 
  text: string, 
  delayMs = 100
): Promise<void> {
  for (const char of text) {
    await locator.type(char, { delay: delayMs });
  }
}

/**
 * Clear input field
 */
export async function clearInput(locator: Locator): Promise<void> {
  await locator.click({ clickCount: 3 }); // Select all
  await locator.press('Backspace');
}
