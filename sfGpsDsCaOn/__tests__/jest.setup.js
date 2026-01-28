/**
 * Jest Setup for sfGpsDsCaOn Tests
 * 
 * Configures Jest with custom matchers and accessibility testing support.
 */

// Import accessibility test helpers
const { toBeAccessible } = require('./accessibility/axeConfig.js');

// Extend Jest expect with custom matchers
expect.extend({
  /**
   * Check if element passes accessibility tests
   * Usage: await expect(element).toBeAccessible();
   */
  toBeAccessible,
  
  /**
   * Check if element has ARIA attribute with value
   * Usage: expect(element).toHaveAriaAttribute('expanded', 'true');
   */
  toHaveAriaAttribute(element, attribute, value) {
    const attrName = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`;
    const actualValue = element.getAttribute(attrName);
    
    if (value === undefined) {
      return {
        pass: actualValue !== null,
        message: () => `Expected element to have ${attrName} attribute`
      };
    }
    
    return {
      pass: actualValue === value,
      message: () => 
        `Expected element to have ${attrName}="${value}", but got "${actualValue}"`
    };
  },
  
  /**
   * Check if element has role
   * Usage: expect(element).toHaveRole('button');
   */
  toHaveRole(element, expectedRole) {
    const actualRole = element.getAttribute('role');
    
    return {
      pass: actualRole === expectedRole,
      message: () => 
        `Expected element to have role="${expectedRole}", but got "${actualRole}"`
    };
  },
  
  /**
   * Check if element is focusable
   * Usage: expect(element).toBeFocusable();
   */
  toBeFocusable(element) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    const isFocusable = focusableSelectors.some(selector => 
      element.matches(selector)
    );
    
    return {
      pass: isFocusable,
      message: () => 
        isFocusable 
          ? 'Expected element not to be focusable'
          : 'Expected element to be focusable'
    };
  },
  
  /**
   * Check if element has Ontario DS class
   * Usage: expect(element).toHaveOntarioClass('ontario-input');
   */
  toHaveOntarioClass(element, className) {
    const fullClassName = className.startsWith('ontario-') 
      ? className 
      : `ontario-${className}`;
    
    return {
      pass: element.classList.contains(fullClassName),
      message: () => 
        `Expected element to have class "${fullClassName}"`
    };
  },
  
  /**
   * Check if form input has associated label
   * Usage: expect(input).toHaveAssociatedLabel();
   */
  toHaveAssociatedLabel(element) {
    const inputId = element.id;
    let hasLabel = false;
    
    // Check for label with for attribute
    if (inputId) {
      const label = document.querySelector(`label[for="${inputId}"]`);
      if (label) hasLabel = true;
    }
    
    // Check for aria-label
    if (!hasLabel && element.hasAttribute('aria-label')) {
      hasLabel = true;
    }
    
    // Check for aria-labelledby
    if (!hasLabel && element.hasAttribute('aria-labelledby')) {
      hasLabel = true;
    }
    
    // Check for wrapping label
    if (!hasLabel && element.closest('label')) {
      hasLabel = true;
    }
    
    return {
      pass: hasLabel,
      message: () => 
        hasLabel 
          ? 'Expected element not to have associated label'
          : 'Expected element to have associated label'
    };
  }
});

// Mock Ontario Design System web components
jest.mock('@ongov/ontario-design-system-component-library', () => ({}), { virtual: true });

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver (not available in jsdom)
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Console error/warning collection for accessibility issues
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Track console errors/warnings
  console.error = jest.fn((...args) => {
    // Still log to console in verbose mode
    if (process.env.VERBOSE) {
      originalConsoleError(...args);
    }
  });
  
  console.warn = jest.fn((...args) => {
    if (process.env.VERBOSE) {
      originalConsoleWarn(...args);
    }
  });
});

afterEach(() => {
  // Restore console
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test timeout
jest.setTimeout(10000);

console.log('Jest setup for sfGpsDsCaOn tests loaded');
