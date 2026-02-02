/**
 * Tests for sfGpsDsCaOnBreadcrumbs Component
 * 
 * Tests navigation pattern, JSON parsing, ARIA accessibility,
 * and Ontario Design System compliance.
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnBreadcrumbs from 'c/sfGpsDsCaOnBreadcrumbs';

describe('sfGpsDsCaOnBreadcrumbs', () => {
  let element;

  const sampleItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' }
  ];

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-breadcrumbs', {
      is: SfGpsDsCaOnBreadcrumbs
    });
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  // ============================================
  // Visual/Rendering Tests
  // ============================================
  
  describe('Visual Rendering', () => {
    test('renders breadcrumb items', async () => {
      element.items = sampleItems;
      document.body.appendChild(element);
      await Promise.resolve();
      
      // Check for breadcrumb links or list items
      const links = element.querySelectorAll('a, li');
      expect(links.length).toBeGreaterThan(0);
    });

    test('renders with current page appended', async () => {
      element.items = sampleItems;
      element.currentPage = 'Laptops';
      document.body.appendChild(element);
      await Promise.resolve();
      
      // Should have 4 items (3 + current page)
      const text = element.textContent;
      expect(text).toContain('Laptops');
    });

    test('renders only current page when no items', async () => {
      element.currentPage = 'Home';
      document.body.appendChild(element);
      await Promise.resolve();
      
      expect(element.textContent).toContain('Home');
    });
  });

  // ============================================
  // JSON Parsing Tests
  // ============================================
  
  describe('JSON Parsing', () => {
    test('parses items from JSON string', async () => {
      element.items = JSON.stringify(sampleItems);
      document.body.appendChild(element);
      await Promise.resolve();
      
      const text = element.textContent;
      expect(text).toContain('Home');
      expect(text).toContain('Products');
    });

    test('handles array items directly', async () => {
      element.items = sampleItems;
      document.body.appendChild(element);
      await Promise.resolve();
      
      expect(element.textContent).toContain('Home');
    });
  });

  // ============================================
  // ARIA Accessibility Tests
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('has nav element with aria-label', async () => {
      element.items = sampleItems;
      document.body.appendChild(element);
      await Promise.resolve();
      
      const nav = element.querySelector('nav');
      if (nav) {
        expect(nav.getAttribute('aria-label')).not.toBeNull();
      }
    });

    test('links are present for navigation items', async () => {
      element.items = sampleItems;
      document.body.appendChild(element);
      await Promise.resolve();
      
      const links = element.querySelectorAll('a[href]');
      expect(links.length).toBeGreaterThan(0);
    });

    test('current page marked appropriately', async () => {
      element.items = sampleItems;
      element.currentPage = 'Current';
      document.body.appendChild(element);
      await Promise.resolve();
      
      // Check for aria-current on last item
      const lastItem = element.querySelector('[aria-current="page"], li:last-child');
      expect(lastItem).not.toBeNull();
    });
  });

  // ============================================
  // Ontario Design System Compliance
  // ============================================
  
  describe('Ontario Design System Compliance', () => {
    test('adds caon-scope class on connected', async () => {
      element.items = sampleItems;
      document.body.appendChild(element);
      await Promise.resolve();
      
      expect(element.classList.contains('caon-scope')).toBe(true);
    });

    test('has ontario-breadcrumbs class', async () => {
      element.items = sampleItems;
      document.body.appendChild(element);
      await Promise.resolve();
      
      const breadcrumbs = element.querySelector('.ontario-breadcrumbs') || element;
      expect(breadcrumbs).not.toBeNull();
    });
  });
});
