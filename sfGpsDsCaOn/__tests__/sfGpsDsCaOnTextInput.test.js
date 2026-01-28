/**
 * Tests for sfGpsDsCaOnTextInput Component
 * 
 * Tests Ontario Design System compliance, AODA accessibility,
 * and functional requirements.
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnTextInput from 'c/sfGpsDsCaOnTextInput';
import { AriaTests, FormTests, KeyboardTests } from './accessibility/helpers';

// Mock for ontario-design-system components
jest.mock('@ongov/ontario-design-system-component-library', () => ({}), { virtual: true });

describe('sfGpsDsCaOnTextInput', () => {
  let element;

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-text-input', {
      is: SfGpsDsCaOnTextInput
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

    test('renders required indicator when required', async () => {
      element.label = 'Required Field';
      element.required = true;
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

    test('renders error icon with error message', async () => {
      element.label = 'Error Field';
      element.errorMessage = 'Error message';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.ontario-error-messaging svg');
      expect(icon).not.toBeNull();
    });
  });

  // ============================================
  // Accessibility Tests - ARIA
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('input has associated label via for/id', async () => {
      element.label = 'Labeled Input';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      const result = FormTests.hasAssociatedLabel(input);
      expect(result.pass).toBe(true);
    });

    test('required input has aria-required', async () => {
      element.label = 'Required Input';
      element.required = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    test('input in error state has aria-invalid', async () => {
      element.label = 'Error Input';
      element.errorMessage = 'Error';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    test('error message linked via aria-describedby', async () => {
      element.label = 'Error Input';
      element.errorMessage = 'Error message';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      const errorEl = element.querySelector('.ontario-error-messaging');
      const describedBy = input.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(errorEl.id);
    });

    test('hint text linked via aria-describedby', async () => {
      element.label = 'With Hint';
      element.hintText = 'Helpful hint';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      const hint = element.querySelector('.ontario-hint');
      const describedBy = input.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(hint.id);
    });
  });

  // ============================================
  // Keyboard Accessibility Tests
  // ============================================
  
  describe('Keyboard Accessibility', () => {
    test('input is focusable', async () => {
      element.label = 'Focusable Input';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      const result = KeyboardTests.isFocusable(input);
      expect(result.pass).toBe(true);
    });

    test('disabled input is not focusable', async () => {
      element.label = 'Disabled Input';
      element.disabled = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      expect(input.disabled).toBe(true);
    });

    test('can type in input', async () => {
      element.label = 'Typeable Input';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      input.value = 'test value';
      input.dispatchEvent(new Event('input'));
      
      expect(input.value).toBe('test value');
    });
  });

  // ============================================
  // Functional Tests
  // ============================================
  
  describe('Functional Behavior', () => {
    test('value updates on input', async () => {
      element.label = 'Value Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      input.value = 'new value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      await Promise.resolve();
      
      expect(element.value).toBe('new value');
    });

    test('blur event fires', async () => {
      element.label = 'Blur Test';
      document.body.appendChild(element);
      
      const blurHandler = jest.fn();
      element.addEventListener('blur', blurHandler);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      
      expect(blurHandler).toHaveBeenCalled();
    });

    test('change event fires', async () => {
      element.label = 'Change Test';
      document.body.appendChild(element);
      
      const changeHandler = jest.fn();
      element.addEventListener('change', changeHandler);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      input.value = 'changed';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(changeHandler).toHaveBeenCalled();
    });

    test('maxLength is enforced', async () => {
      element.label = 'MaxLength Test';
      element.maxLength = 5;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      expect(input.getAttribute('maxlength')).toBe('5');
    });

    test('readonly prevents editing', async () => {
      element.label = 'Readonly Test';
      element.readonly = true;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      expect(input.readOnly).toBe(true);
    });

    test('pattern validation applied', async () => {
      element.label = 'Pattern Test';
      element.pattern = '[A-Z]+';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      expect(input.getAttribute('pattern')).toBe('[A-Z]+');
    });
  });

  // ============================================
  // Ontario Design System Compliance
  // ============================================
  
  describe('Ontario Design System Compliance', () => {
    test('uses ontario form group class', async () => {
      element.label = 'ODS Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const formGroup = element.querySelector('.ontario-form-group');
      expect(formGroup).not.toBeNull();
    });

    test('uses ontario label class', async () => {
      element.label = 'ODS Label';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const label = element.querySelector('.ontario-label');
      expect(label).not.toBeNull();
    });

    test('uses ontario input class', async () => {
      element.label = 'ODS Input';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('.ontario-input');
      expect(input).not.toBeNull();
    });

    test('uses ontario error styling', async () => {
      element.label = 'ODS Error';
      element.errorMessage = 'Error';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const input = element.querySelector('input');
      expect(input.classList.contains('ontario-input__error')).toBe(true);
    });
  });
});
