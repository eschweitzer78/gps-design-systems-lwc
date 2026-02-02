/**
 * Tests for sfGpsDsCaOnTextArea Component
 * 
 * Tests Ontario Design System compliance, AODA accessibility,
 * and textarea-specific functionality.
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnTextArea from 'c/sfGpsDsCaOnTextArea';
import { AriaTests, FormTests, KeyboardTests } from './accessibility/helpers';

describe('sfGpsDsCaOnTextArea', () => {
  let element;

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-text-area', {
      is: SfGpsDsCaOnTextArea
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
    test('renders with label', async () => {
      element.label = 'Test Label';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const label = element.querySelector('label');
      expect(label).not.toBeNull();
      expect(label.textContent).toContain('Test Label');
    });

    test('renders textarea element', async () => {
      element.label = 'TextArea';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea).not.toBeNull();
    });

    test('renders required indicator when required', async () => {
      element.label = 'Required Field';
      element.required = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const flag = element.querySelector('.ontario-label__flag');
      expect(flag).not.toBeNull();
    });

    test('renders optional indicator when optional', async () => {
      element.label = 'Optional Field';
      element.optional = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const flag = element.querySelector('.ontario-label__flag');
      expect(flag).not.toBeNull();
    });

    test('renders hint text when provided', async () => {
      element.label = 'With Hint';
      element.hintText = 'This is a hint';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const hint = element.querySelector('.ontario-hint');
      expect(hint).not.toBeNull();
      expect(hint.textContent).toContain('This is a hint');
    });

    test('renders error message when in error state', async () => {
      element.label = 'Error Field';
      element.errorMessage = 'This field has an error';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const error = element.querySelector('.ontario-error-messaging');
      expect(error).not.toBeNull();
      expect(error.textContent).toContain('This field has an error');
    });

    test('renders with specified number of rows', async () => {
      element.label = 'Multi-row';
      element.rows = 10;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.rows).toBe(10);
    });

    test('renders with default rows when not specified', async () => {
      element.label = 'Default Rows';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.rows).toBe(5);
    });
  });

  // ============================================
  // Accessibility Tests - ARIA
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('textarea has associated label via for/id', async () => {
      element.label = 'Labeled TextArea';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const label = element.querySelector('label');
      const textarea = element.querySelector('textarea');
      
      expect(label.getAttribute('for')).toBe(textarea.id);
    });

    test('textarea has aria-describedby when hint present', async () => {
      element.label = 'With Hint';
      element.hintText = 'Enter your message';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.getAttribute('aria-describedby')).not.toBeNull();
    });

    test('textarea has aria-invalid when error', async () => {
      element.label = 'Error Field';
      element.errorMessage = 'This field is invalid';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.getAttribute('aria-invalid')).toBe('true');
    });

    test('textarea has aria-required when required', async () => {
      element.label = 'Required';
      element.required = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.hasAttribute('required') || textarea.getAttribute('aria-required') === 'true').toBe(true);
    });
  });

  // ============================================
  // Keyboard Accessibility Tests
  // ============================================
  
  describe('Keyboard Accessibility', () => {
    test('textarea is focusable', async () => {
      element.label = 'Focusable';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea).not.toBeNull();
      expect(textarea.tabIndex).toBeGreaterThanOrEqual(0);
    });

    test('focus event dispatched on focus', async () => {
      element.label = 'Focus Test';
      document.body.appendChild(element);
      
      const focusHandler = jest.fn();
      element.addEventListener('focus', focusHandler);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      textarea.focus();
      textarea.dispatchEvent(new FocusEvent('focus'));
      
      expect(focusHandler).toHaveBeenCalled();
    });
  });

  // ============================================
  // Functional Behavior Tests
  // ============================================
  
  describe('Functional Behavior', () => {
    test('dispatches input event on typing', async () => {
      element.label = 'Input Test';
      document.body.appendChild(element);
      
      const inputHandler = jest.fn();
      element.addEventListener('input', inputHandler);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      textarea.value = 'Hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      expect(inputHandler).toHaveBeenCalled();
    });

    test('dispatches change event on change', async () => {
      element.label = 'Change Test';
      document.body.appendChild(element);
      
      const changeHandler = jest.fn();
      element.addEventListener('change', changeHandler);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      textarea.value = 'Changed';
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(changeHandler).toHaveBeenCalled();
    });

    test('respects disabled state', async () => {
      element.label = 'Disabled';
      element.disabled = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.disabled).toBe(true);
    });

    test('respects readonly state', async () => {
      element.label = 'Readonly';
      element.readonly = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.readOnly).toBe(true);
    });
  });

  // ============================================
  // Validation Tests
  // ============================================
  
  describe('Validation', () => {
    test('checkValidity returns true for valid input', async () => {
      element.label = 'Valid';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.checkValidity()).toBe(true);
    });

    test('respects maxLength attribute', async () => {
      element.label = 'Max Length';
      element.maxLength = 100;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.maxLength).toBe(100);
    });

    test('respects minLength attribute', async () => {
      element.label = 'Min Length';
      element.minLength = 10;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.minLength).toBe(10);
    });
  });

  // ============================================
  // Ontario Design System Compliance
  // ============================================
  
  describe('Ontario Design System Compliance', () => {
    test('uses ontario-textarea class', async () => {
      element.label = 'ODS Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.classList.contains('ontario-textarea')).toBe(true);
    });

    test('uses ontario-input class', async () => {
      element.label = 'ODS Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.classList.contains('ontario-input')).toBe(true);
    });

    test('adds error class when error message present', async () => {
      element.label = 'Error ODS';
      element.errorMessage = 'Error';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const textarea = element.querySelector('textarea');
      expect(textarea.classList.contains('ontario-input__error')).toBe(true);
    });

    test('adds caon-scope class on connected', async () => {
      element.label = 'Scope Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.classList.contains('caon-scope')).toBe(true);
    });
  });
});
