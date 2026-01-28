/**
 * Accessibility Test Helper for Ontario Design System Components
 * 
 * Provides utilities for testing AODA/WCAG 2.1 AA compliance in LWC components.
 */

/**
 * ARIA attribute test utilities
 */
const AriaTests = {
  /**
   * Check if element has required ARIA attributes
   * @param {HTMLElement} element - Element to test
   * @param {string[]} requiredAttrs - Required ARIA attributes
   * @returns {Object} Test result with pass/fail and details
   */
  hasRequiredAriaAttributes(element, requiredAttrs) {
    const missing = [];
    const present = [];
    
    requiredAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        present.push(attr);
      } else {
        missing.push(attr);
      }
    });
    
    return {
      pass: missing.length === 0,
      present,
      missing,
      message: missing.length === 0
        ? `Element has all required ARIA attributes: ${present.join(', ')}`
        : `Element missing ARIA attributes: ${missing.join(', ')}`
    };
  },
  
  /**
   * Check if aria-describedby references exist
   * @param {HTMLElement} element - Element with aria-describedby
   * @returns {Object} Test result
   */
  ariaDescribedByReferencesExist(element) {
    const describedBy = element.getAttribute('aria-describedby');
    if (!describedBy) {
      return { pass: true, message: 'No aria-describedby attribute' };
    }
    
    const ids = describedBy.split(' ').filter(id => id.trim());
    const missing = [];
    const found = [];
    
    ids.forEach(id => {
      const referenced = document.getElementById(id);
      if (referenced) {
        found.push(id);
      } else {
        missing.push(id);
      }
    });
    
    return {
      pass: missing.length === 0,
      found,
      missing,
      message: missing.length === 0
        ? `All aria-describedby references exist: ${found.join(', ')}`
        : `Missing aria-describedby references: ${missing.join(', ')}`
    };
  },
  
  /**
   * Check if aria-labelledby references exist
   * @param {HTMLElement} element - Element with aria-labelledby
   * @returns {Object} Test result
   */
  ariaLabelledByReferencesExist(element) {
    const labelledBy = element.getAttribute('aria-labelledby');
    if (!labelledBy) {
      return { pass: true, message: 'No aria-labelledby attribute' };
    }
    
    const ids = labelledBy.split(' ').filter(id => id.trim());
    const missing = [];
    
    ids.forEach(id => {
      if (!document.getElementById(id)) {
        missing.push(id);
      }
    });
    
    return {
      pass: missing.length === 0,
      missing,
      message: missing.length === 0
        ? 'All aria-labelledby references exist'
        : `Missing aria-labelledby references: ${missing.join(', ')}`
    };
  }
};

/**
 * Form accessibility test utilities
 */
const FormTests = {
  /**
   * Check if form input has associated label
   * @param {HTMLInputElement} input - Input element
   * @returns {Object} Test result
   */
  hasAssociatedLabel(input) {
    const inputId = input.id;
    let hasLabel = false;
    let labelText = '';
    
    // Check for label with for attribute
    if (inputId) {
      const label = document.querySelector(`label[for="${inputId}"]`);
      if (label) {
        hasLabel = true;
        labelText = label.textContent?.trim() || '';
      }
    }
    
    // Check for aria-label
    if (!hasLabel && input.hasAttribute('aria-label')) {
      hasLabel = true;
      labelText = input.getAttribute('aria-label') || '';
    }
    
    // Check for aria-labelledby
    if (!hasLabel && input.hasAttribute('aria-labelledby')) {
      const labelId = input.getAttribute('aria-labelledby');
      const labelEl = document.getElementById(labelId);
      if (labelEl) {
        hasLabel = true;
        labelText = labelEl.textContent?.trim() || '';
      }
    }
    
    // Check for wrapping label
    if (!hasLabel) {
      const parentLabel = input.closest('label');
      if (parentLabel) {
        hasLabel = true;
        labelText = parentLabel.textContent?.trim() || '';
      }
    }
    
    return {
      pass: hasLabel,
      labelText,
      message: hasLabel
        ? `Input has label: "${labelText}"`
        : 'Input has no associated label'
    };
  },
  
  /**
   * Check if required input has aria-required
   * @param {HTMLInputElement} input - Input element
   * @returns {Object} Test result
   */
  requiredInputHasAriaRequired(input) {
    const isRequired = input.required || input.hasAttribute('required');
    const hasAriaRequired = input.getAttribute('aria-required') === 'true';
    
    if (!isRequired) {
      return { pass: true, message: 'Input is not required' };
    }
    
    return {
      pass: hasAriaRequired,
      message: hasAriaRequired
        ? 'Required input has aria-required="true"'
        : 'Required input missing aria-required="true"'
    };
  },
  
  /**
   * Check if input in error state has aria-invalid
   * @param {HTMLInputElement} input - Input element
   * @param {boolean} hasError - Whether input has error
   * @returns {Object} Test result
   */
  errorInputHasAriaInvalid(input, hasError) {
    const ariaInvalid = input.getAttribute('aria-invalid');
    
    if (!hasError) {
      return {
        pass: ariaInvalid !== 'true',
        message: ariaInvalid === 'true'
          ? 'Input without error should not have aria-invalid="true"'
          : 'Input correctly has no aria-invalid'
      };
    }
    
    return {
      pass: ariaInvalid === 'true',
      message: ariaInvalid === 'true'
        ? 'Error input has aria-invalid="true"'
        : 'Error input missing aria-invalid="true"'
    };
  },
  
  /**
   * Check if error message is linked via aria-describedby
   * @param {HTMLInputElement} input - Input element
   * @param {string} errorId - Error message element ID
   * @returns {Object} Test result
   */
  errorLinkedToInput(input, errorId) {
    const describedBy = input.getAttribute('aria-describedby') || '';
    const isLinked = describedBy.split(' ').includes(errorId);
    
    return {
      pass: isLinked,
      message: isLinked
        ? `Error ${errorId} is linked to input via aria-describedby`
        : `Error ${errorId} is not linked to input`
    };
  }
};

/**
 * Keyboard accessibility test utilities
 */
const KeyboardTests = {
  /**
   * Check if element is focusable
   * @param {HTMLElement} element - Element to test
   * @returns {Object} Test result
   */
  isFocusable(element) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];
    
    const isFocusable = focusableSelectors.some(selector => 
      element.matches(selector)
    );
    
    return {
      pass: isFocusable,
      message: isFocusable
        ? 'Element is keyboard focusable'
        : 'Element is not keyboard focusable'
    };
  },
  
  /**
   * Check if interactive element has visible focus indicator
   * @param {HTMLElement} element - Element to test
   * @returns {Object} Test result (requires manual verification)
   */
  hasFocusIndicator(element) {
    // This requires visual inspection or computed style check
    const computedStyle = window.getComputedStyle(element);
    const outline = computedStyle.outline;
    const boxShadow = computedStyle.boxShadow;
    
    const hasOutline = outline && outline !== 'none' && !outline.includes('0px');
    const hasBoxShadow = boxShadow && boxShadow !== 'none';
    
    return {
      pass: hasOutline || hasBoxShadow,
      outline,
      boxShadow,
      message: 'Focus indicator check requires visual verification'
    };
  },
  
  /**
   * Get tab order of focusable elements in container
   * @param {HTMLElement} container - Container element
   * @returns {HTMLElement[]} Array of elements in tab order
   */
  getTabOrder(container) {
    const focusableElements = container.querySelectorAll(`
      a[href],
      button:not([disabled]),
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [tabindex]:not([tabindex="-1"])
    `);
    
    return Array.from(focusableElements).sort((a, b) => {
      const aIndex = parseInt(a.getAttribute('tabindex') || '0', 10);
      const bIndex = parseInt(b.getAttribute('tabindex') || '0', 10);
      
      if (aIndex === bIndex) return 0;
      if (aIndex === 0) return 1;
      if (bIndex === 0) return -1;
      return aIndex - bIndex;
    });
  },
  
  /**
   * Simulate keyboard event on element
   * @param {HTMLElement} element - Target element
   * @param {string} key - Key to simulate
   * @param {Object} options - Event options
   */
  simulateKeyPress(element, key, options = {}) {
    const event = new KeyboardEvent('keydown', {
      key,
      code: key,
      bubbles: true,
      cancelable: true,
      ...options
    });
    element.dispatchEvent(event);
  }
};

/**
 * Color contrast test utilities
 */
const ContrastTests = {
  /**
   * Calculate relative luminance of a color
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {number} Relative luminance
   */
  getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },
  
  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color (hex or rgb)
   * @param {string} color2 - Second color (hex or rgb)
   * @returns {number} Contrast ratio
   */
  getContrastRatio(color1, color2) {
    const parseColor = (color) => {
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        return [
          parseInt(hex.substr(0, 2), 16),
          parseInt(hex.substr(2, 2), 16),
          parseInt(hex.substr(4, 2), 16)
        ];
      }
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      }
      return [0, 0, 0];
    };
    
    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);
    
    const l1 = this.getLuminance(r1, g1, b1);
    const l2 = this.getLuminance(r2, g2, b2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },
  
  /**
   * Check if contrast meets WCAG AA requirements
   * @param {number} ratio - Contrast ratio
   * @param {boolean} isLargeText - Whether text is large (18pt+ or 14pt bold)
   * @returns {Object} Test result
   */
  meetsWcagAA(ratio, isLargeText = false) {
    const requirement = isLargeText ? 3 : 4.5;
    const pass = ratio >= requirement;
    
    return {
      pass,
      ratio: ratio.toFixed(2),
      requirement,
      message: pass
        ? `Contrast ratio ${ratio.toFixed(2)}:1 meets WCAG AA (${requirement}:1)`
        : `Contrast ratio ${ratio.toFixed(2)}:1 fails WCAG AA (requires ${requirement}:1)`
    };
  }
};

/**
 * Screen reader announcement test utilities
 */
const LiveRegionTests = {
  /**
   * Check if element is a live region
   * @param {HTMLElement} element - Element to test
   * @returns {Object} Test result
   */
  isLiveRegion(element) {
    const ariaLive = element.getAttribute('aria-live');
    const role = element.getAttribute('role');
    const liveRoles = ['alert', 'status', 'log', 'marquee', 'timer'];
    
    const isLive = ariaLive !== null || liveRoles.includes(role);
    
    return {
      pass: isLive,
      ariaLive,
      role,
      message: isLive
        ? `Element is live region (aria-live="${ariaLive}", role="${role}")`
        : 'Element is not a live region'
    };
  },
  
  /**
   * Check if live region has appropriate politeness
   * @param {HTMLElement} element - Live region element
   * @param {string} expectedPoliteness - Expected aria-live value
   * @returns {Object} Test result
   */
  hasCorrectPoliteness(element, expectedPoliteness) {
    const ariaLive = element.getAttribute('aria-live');
    
    return {
      pass: ariaLive === expectedPoliteness,
      actual: ariaLive,
      expected: expectedPoliteness,
      message: ariaLive === expectedPoliteness
        ? `Live region has correct politeness: ${ariaLive}`
        : `Expected aria-live="${expectedPoliteness}", got "${ariaLive}"`
    };
  }
};

module.exports = {
  AriaTests,
  FormTests,
  KeyboardTests,
  ContrastTests,
  LiveRegionTests
};
