/**
 * Functional Test Helper for Ontario Design System Components
 * 
 * Provides utilities for testing component functionality,
 * events, and OmniScript integration.
 */

/**
 * Component event testing utilities
 */
const EventTests = {
  /**
   * Create a promise that resolves when an event fires
   * @param {HTMLElement} element - Element to listen on
   * @param {string} eventName - Event name to wait for
   * @param {number} timeout - Timeout in ms
   * @returns {Promise} Resolves with event, rejects on timeout
   */
  waitForEvent(element, eventName, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${eventName} event`));
      }, timeout);
      
      element.addEventListener(eventName, (event) => {
        clearTimeout(timer);
        resolve(event);
      }, { once: true });
    });
  },
  
  /**
   * Create a spy for an event
   * @param {HTMLElement} element - Element to listen on
   * @param {string} eventName - Event name to spy on
   * @returns {Object} Spy object with calls array and remove function
   */
  spyOnEvent(element, eventName) {
    const spy = {
      calls: [],
      remove: null
    };
    
    const handler = (event) => {
      spy.calls.push({
        detail: event.detail,
        target: event.target,
        timestamp: Date.now()
      });
    };
    
    element.addEventListener(eventName, handler);
    spy.remove = () => element.removeEventListener(eventName, handler);
    
    return spy;
  },
  
  /**
   * Dispatch a custom event
   * @param {HTMLElement} element - Target element
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail
   * @param {Object} options - Event options
   */
  dispatchCustomEvent(element, eventName, detail = {}, options = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
      ...options
    });
    element.dispatchEvent(event);
  }
};

/**
 * Form input testing utilities
 */
const InputTests = {
  /**
   * Simulate typing in an input
   * @param {HTMLInputElement} input - Input element
   * @param {string} value - Value to type
   */
  async typeValue(input, value) {
    input.focus();
    input.value = '';
    
    for (const char of value) {
      input.value += char;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    input.dispatchEvent(new Event('change', { bubbles: true }));
  },
  
  /**
   * Clear an input
   * @param {HTMLInputElement} input - Input element
   */
  clearValue(input) {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  },
  
  /**
   * Simulate blur event
   * @param {HTMLElement} element - Element to blur
   */
  blur(element) {
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  },
  
  /**
   * Simulate focus event
   * @param {HTMLElement} element - Element to focus
   */
  focus(element) {
    element.focus();
    element.dispatchEvent(new Event('focus', { bubbles: true }));
  },
  
  /**
   * Set value and trigger events
   * @param {HTMLInputElement} input - Input element
   * @param {string} value - Value to set
   */
  setValue(input, value) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

/**
 * Dropdown/Select testing utilities
 */
const DropdownTests = {
  /**
   * Open a dropdown
   * @param {HTMLElement} trigger - Dropdown trigger element
   */
  open(trigger) {
    trigger.click();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  },
  
  /**
   * Close a dropdown
   * @param {HTMLElement} trigger - Dropdown trigger element
   */
  close(trigger) {
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  },
  
  /**
   * Select an option by index
   * @param {HTMLElement} container - Container with options
   * @param {number} index - Option index to select
   */
  selectOptionByIndex(container, index) {
    const options = container.querySelectorAll('[role="option"]');
    if (options[index]) {
      options[index].click();
    }
  },
  
  /**
   * Select an option by value
   * @param {HTMLElement} container - Container with options
   * @param {string} value - Option value to select
   */
  selectOptionByValue(container, value) {
    const options = container.querySelectorAll('[role="option"]');
    const option = Array.from(options).find(
      opt => opt.textContent?.trim() === value || opt.dataset.value === value
    );
    if (option) {
      option.click();
    }
  },
  
  /**
   * Get all option values
   * @param {HTMLElement} container - Container with options
   * @returns {string[]} Array of option values
   */
  getOptionValues(container) {
    const options = container.querySelectorAll('[role="option"]');
    return Array.from(options).map(opt => opt.textContent?.trim() || '');
  }
};

/**
 * Validation testing utilities
 */
const ValidationTests = {
  /**
   * Trigger validation on an input
   * @param {HTMLInputElement} input - Input element
   */
  triggerValidation(input) {
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    input.checkValidity();
  },
  
  /**
   * Check if input has validation error
   * @param {HTMLInputElement} input - Input element
   * @returns {boolean} True if has error
   */
  hasValidationError(input) {
    return !input.validity.valid || 
           input.getAttribute('aria-invalid') === 'true' ||
           input.classList.contains('ontario-input__error');
  },
  
  /**
   * Get validation message
   * @param {HTMLElement} container - Container element
   * @returns {string|null} Error message or null
   */
  getErrorMessage(container) {
    const errorEl = container.querySelector('.ontario-error-messaging, [role="alert"]');
    return errorEl?.textContent?.trim() || null;
  },
  
  /**
   * Test required validation
   * @param {HTMLInputElement} input - Input element
   * @returns {boolean} True if required validation works
   */
  testRequiredValidation(input) {
    if (!input.required) return true;
    
    input.value = '';
    this.triggerValidation(input);
    return !input.validity.valid;
  },
  
  /**
   * Test pattern validation
   * @param {HTMLInputElement} input - Input element
   * @param {string} invalidValue - Value that should fail
   * @returns {boolean} True if pattern validation works
   */
  testPatternValidation(input, invalidValue) {
    if (!input.pattern) return true;
    
    input.value = invalidValue;
    this.triggerValidation(input);
    return !input.validity.valid;
  }
};

/**
 * OmniScript integration testing utilities
 */
const OmniScriptTests = {
  /**
   * Mock OmniScript _propSetMap
   * @param {Object} props - Properties to include
   * @returns {Object} Mock propSetMap
   */
  createMockPropSetMap(props = {}) {
    return {
      label: 'Test Field',
      required: false,
      readOnly: false,
      disabled: false,
      placeholder: '',
      helpText: '',
      ...props
    };
  },
  
  /**
   * Mock OmniScript jsonDef
   * @param {Object} def - Definition overrides
   * @returns {Object} Mock jsonDef
   */
  createMockJsonDef(def = {}) {
    return {
      name: 'TestField',
      lwcId: 'test-field-1',
      type: 'Text',
      ...def
    };
  },
  
  /**
   * Check if component has data-omni-input
   * @param {HTMLElement} element - Component element
   * @returns {boolean} True if has attribute
   */
  hasOmniInputMarker(element) {
    return element.querySelector('[data-omni-input]') !== null;
  },
  
  /**
   * Mock applyCallResp function
   * @returns {Object} Mock with spy
   */
  createMockApplyCallResp() {
    const calls = [];
    return {
      fn: (value) => {
        calls.push(value);
      },
      calls,
      getCalls: () => calls
    };
  }
};

/**
 * Async utilities for testing
 */
const AsyncTests = {
  /**
   * Wait for component to render
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Resolves after timeout
   */
  async waitForRender(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * Wait for condition to be true
   * @param {Function} condition - Function that returns boolean
   * @param {number} timeout - Max wait time in ms
   * @param {number} interval - Check interval in ms
   * @returns {Promise} Resolves when condition is true
   */
  async waitForCondition(condition, timeout = 5000, interval = 100) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Condition not met within timeout');
  },
  
  /**
   * Wait for element to appear
   * @param {HTMLElement} container - Container to search in
   * @param {string} selector - CSS selector
   * @param {number} timeout - Max wait time in ms
   * @returns {Promise<HTMLElement>} Found element
   */
  async waitForElement(container, selector, timeout = 5000) {
    return this.waitForCondition(
      () => container.querySelector(selector) !== null,
      timeout
    ).then(() => container.querySelector(selector));
  },
  
  /**
   * Flush all pending promises
   * @returns {Promise} Resolves when promises flushed
   */
  async flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
  }
};

module.exports = {
  EventTests,
  InputTests,
  DropdownTests,
  ValidationTests,
  OmniScriptTests,
  AsyncTests
};
