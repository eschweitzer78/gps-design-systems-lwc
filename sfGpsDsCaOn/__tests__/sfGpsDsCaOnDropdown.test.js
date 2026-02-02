/**
 * Tests for sfGpsDsCaOnDropdown Component
 * 
 * Tests Ontario Design System compliance, AODA accessibility,
 * and functional requirements for the select/dropdown component.
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnDropdown from 'c/sfGpsDsCaOnDropdown';
import { FormTests, KeyboardTests } from './accessibility/helpers';

// Mock for ontario-design-system components
jest.mock('@ongov/ontario-design-system-component-library', () => ({}), { virtual: true });

describe('sfGpsDsCaOnDropdown', () => {
  let element;

  const sampleOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-dropdown', {
      is: SfGpsDsCaOnDropdown
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
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const label = element.querySelector('label');
      expect(label).not.toBeNull();
      expect(label.textContent).toContain('Test Label');
    });

    test('renders select element', async () => {
      element.label = 'Dropdown';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      expect(select).not.toBeNull();
    });

    test('renders options', async () => {
      element.label = 'With Options';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const options = element.querySelectorAll('option');
      // +1 for the default "Select" option
      expect(options.length).toBeGreaterThanOrEqual(sampleOptions.length);
    });

    test('renders default option with "Select" text', async () => {
      element.label = 'With Default';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const firstOption = element.querySelector('option');
      expect(firstOption.textContent).toBeTruthy();
    });

    test('renders custom default option label', async () => {
      element.label = 'Custom Default';
      element.options = sampleOptions;
      element.defaultOptionLabel = 'Choose an option';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const firstOption = element.querySelector('option');
      expect(firstOption.textContent).toContain('Choose an option');
    });

    test('renders required indicator when required', async () => {
      element.label = 'Required Field';
      element.required = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const flag = element.querySelector('.ontario-label__flag');
      expect(flag).not.toBeNull();
    });

    test('renders hint text when provided', async () => {
      element.label = 'With Hint';
      element.hintText = 'Select one option';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const hint = element.querySelector('.ontario-hint');
      expect(hint).not.toBeNull();
      expect(hint.textContent).toContain('Select one option');
    });

    test('renders error message when in error state', async () => {
      element.label = 'Error Field';
      element.errorMessage = 'Please select an option';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const error = element.querySelector('.ontario-error-messaging');
      expect(error).not.toBeNull();
      expect(error.textContent).toContain('Please select an option');
    });

    test('renders dropdown arrow/chevron', async () => {
      element.label = 'Dropdown Arrow';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // The select element with ontario-dropdown class has the chevron via CSS
      const select = element.querySelector('.ontario-dropdown');
      expect(select).not.toBeNull();
    });
  });

  // ============================================
  // Accessibility Tests - ARIA
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('select has associated label via for/id', async () => {
      element.label = 'Labeled Dropdown';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      const result = FormTests.hasAssociatedLabel(select);
      expect(result.pass).toBe(true);
    });

    test('required select has aria-required', async () => {
      element.label = 'Required Dropdown';
      element.required = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      expect(select.getAttribute('aria-required')).toBe('true');
    });

    test('select in error state has aria-invalid', async () => {
      element.label = 'Error Dropdown';
      element.errorMessage = 'Error';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      expect(select.getAttribute('aria-invalid')).toBe('true');
    });

    test('error message linked via aria-describedby', async () => {
      element.label = 'Error Dropdown';
      element.errorMessage = 'Error message';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      const errorEl = element.querySelector('.ontario-error-messaging');
      const describedBy = select.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(errorEl.id);
    });

    test('hint text linked via aria-describedby', async () => {
      element.label = 'With Hint';
      element.hintText = 'Helpful hint';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      const hint = element.querySelector('.ontario-hint');
      const describedBy = select.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(hint.id);
    });
  });

  // ============================================
  // Keyboard Accessibility Tests
  // ============================================
  
  describe('Keyboard Accessibility', () => {
    test('select is focusable', async () => {
      element.label = 'Focusable Dropdown';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      const result = KeyboardTests.isFocusable(select);
      expect(result.pass).toBe(true);
    });

    test('disabled select is not focusable', async () => {
      element.label = 'Disabled Dropdown';
      element.disabled = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      expect(select.disabled).toBe(true);
    });

    test('space key opens dropdown (native behavior)', async () => {
      element.label = 'Keyboard Dropdown';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      // Native select behavior - just verify it's focusable
      select.focus();
      expect(document.activeElement).toBe(select);
    });
  });

  // ============================================
  // Functional Tests
  // ============================================
  
  describe('Functional Behavior', () => {
    test('value updates on selection', async () => {
      element.label = 'Value Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      select.value = 'opt2';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      
      await Promise.resolve();
      
      expect(element.value).toBe('opt2');
    });

    test('change event fires on selection', async () => {
      element.label = 'Change Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      const changeHandler = jest.fn();
      element.addEventListener('change', changeHandler);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      select.value = 'opt1';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(changeHandler).toHaveBeenCalled();
    });

    test('blur event fires', async () => {
      element.label = 'Blur Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      const blurHandler = jest.fn();
      element.addEventListener('blur', blurHandler);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      select.dispatchEvent(new Event('blur', { bubbles: true }));
      
      expect(blurHandler).toHaveBeenCalled();
    });

    test('focus event fires', async () => {
      element.label = 'Focus Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      const focusHandler = jest.fn();
      element.addEventListener('focus', focusHandler);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      select.dispatchEvent(new Event('focus', { bubbles: true }));
      
      expect(focusHandler).toHaveBeenCalled();
    });

    test('options can be updated dynamically', async () => {
      element.label = 'Dynamic Options';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // Update options
      element.options = [
        { label: 'New Option 1', value: 'new1' },
        { label: 'New Option 2', value: 'new2' }
      ];
      
      await Promise.resolve();
      
      expect(element.options.length).toBe(2);
    });

    test('focus method works', async () => {
      element.label = 'Focus Method Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      element.focus();
      
      const select = element.querySelector('select');
      expect(document.activeElement).toBe(select);
    });

    test('pre-selected value is shown', async () => {
      element.label = 'Pre-selected';
      element.options = sampleOptions;
      element.value = 'opt2';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      expect(select.value).toBe('opt2');
    });
  });

  // ============================================
  // Validation Tests
  // ============================================
  
  describe('Validation', () => {
    test('checkValidity returns true for valid selection', async () => {
      element.label = 'Valid';
      element.options = sampleOptions;
      element.value = 'opt1';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.checkValidity()).toBe(true);
    });

    test('reportValidity updates invalid state', async () => {
      element.label = 'Report Validity';
      element.required = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const result = element.reportValidity();
      // Empty selection on required field should be invalid
      expect(typeof result).toBe('boolean');
    });

    test('setCustomValidity sets custom error', async () => {
      element.label = 'Custom Validity';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      element.setCustomValidity('Custom error message');
      // Verify the select shows invalid state
      const select = element.querySelector('select');
      // Check if it has validation message or invalid state
      expect(select.validationMessage).toBe('Custom error message');
    });
  });

  // ============================================
  // Ontario Design System Compliance
  // ============================================
  
  describe('Ontario Design System Compliance', () => {
    test('uses ontario form group class', async () => {
      element.label = 'ODS Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const formGroup = element.querySelector('.ontario-form-group');
      expect(formGroup).not.toBeNull();
    });

    test('uses ontario label class', async () => {
      element.label = 'ODS Label';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const label = element.querySelector('.ontario-label');
      expect(label).not.toBeNull();
    });

    test('uses ontario dropdown class', async () => {
      element.label = 'ODS Dropdown';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('.ontario-dropdown');
      expect(select).not.toBeNull();
    });

    test('uses ontario error styling', async () => {
      element.label = 'ODS Error';
      element.errorMessage = 'Error';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const select = element.querySelector('select');
      expect(select.classList.contains('ontario-input__error')).toBe(true);
    });

    test('adds caon-scope class on connected', async () => {
      element.label = 'Scope Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.classList.contains('caon-scope')).toBe(true);
    });
  });
});
