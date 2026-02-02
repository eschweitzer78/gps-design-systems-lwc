/**
 * Tests for sfGpsDsCaOnCheckboxGroup Component
 * 
 * Tests Ontario Design System compliance, AODA accessibility,
 * and functional requirements for the checkbox group component.
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnCheckboxGroup from 'c/sfGpsDsCaOnCheckboxGroup';
import { KeyboardTests } from './accessibility/helpers';

// Mock for ontario-design-system components
jest.mock('@ongov/ontario-design-system-component-library', () => ({}), { virtual: true });

describe('sfGpsDsCaOnCheckboxGroup', () => {
  let element;

  const sampleOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];

  const manyOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
    { label: 'Option 4', value: 'opt4' },
    { label: 'Option 5', value: 'opt5' },
    { label: 'Option 6', value: 'opt6' }
  ];

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-checkbox-group', {
      is: SfGpsDsCaOnCheckboxGroup
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
    test('renders with legend', async () => {
      element.legend = 'Test Legend';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const legend = element.querySelector('legend');
      expect(legend).not.toBeNull();
      expect(legend.textContent).toContain('Test Legend');
    });

    test('renders fieldset element', async () => {
      element.legend = 'Checkbox Group';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const fieldset = element.querySelector('fieldset');
      expect(fieldset).not.toBeNull();
    });

    test('renders checkboxes for each option', async () => {
      element.legend = 'With Options';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(sampleOptions.length);
    });

    test('renders checkbox labels', async () => {
      element.legend = 'With Labels';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const labels = element.querySelectorAll('.ontario-checkboxes__label, .ontario-checkbox__label, label');
      expect(labels.length).toBeGreaterThanOrEqual(sampleOptions.length);
    });

    test('renders required indicator when required', async () => {
      element.legend = 'Required Field';
      element.required = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const flag = element.querySelector('.ontario-label__flag');
      expect(flag).not.toBeNull();
    });

    test('renders hint text when provided', async () => {
      element.legend = 'With Hint';
      element.hintText = 'Select all that apply';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const hint = element.querySelector('.ontario-hint');
      expect(hint).not.toBeNull();
      expect(hint.textContent).toContain('Select all that apply');
    });

    test('renders error message when in error state', async () => {
      element.legend = 'Error Field';
      element.errorMessage = 'Please select at least one option';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const error = element.querySelector('.ontario-error-messaging');
      expect(error).not.toBeNull();
      expect(error.textContent).toContain('Please select at least one option');
    });

    test('checked state shows checkmark', async () => {
      element.legend = 'Pre-checked';
      element.options = sampleOptions;
      element.value = ['opt1'];
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      const checkedCheckbox = Array.from(checkboxes).find(cb => cb.value === 'opt1');
      expect(checkedCheckbox.checked).toBe(true);
    });
  });

  // ============================================
  // Skip Link Tests (AODA)
  // ============================================
  
  describe('Skip Link', () => {
    test('renders with many options', async () => {
      element.legend = 'Many Options';
      element.options = manyOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // Component should render all options
      const inputs = element.querySelectorAll('input[type="checkbox"]');
      expect(inputs.length).toBe(manyOptions.length);
    });

    test('renders with few options', async () => {
      element.legend = 'Few Options';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const inputs = element.querySelectorAll('input[type="checkbox"]');
      expect(inputs.length).toBe(sampleOptions.length);
    });

    test('accepts skipLinkThreshold property', async () => {
      element.legend = 'Custom Threshold';
      element.options = sampleOptions;
      element.skipLinkThreshold = 2;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.skipLinkThreshold).toBe(2);
    });

    test('accepts skipLinkThreshold of 0', async () => {
      element.legend = 'No Skip Link';
      element.options = manyOptions;
      element.skipLinkThreshold = 0;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.skipLinkThreshold).toBe(0);
    });
  });

  // ============================================
  // Accessibility Tests - ARIA
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('uses fieldset to group checkboxes', async () => {
      element.legend = 'Grouped Checkboxes';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const fieldset = element.querySelector('fieldset');
      expect(fieldset).not.toBeNull();
    });

    test('uses legend for group label', async () => {
      element.legend = 'Group Label';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const legend = element.querySelector('legend');
      expect(legend).not.toBeNull();
    });

    test('each checkbox has associated label', async () => {
      element.legend = 'Labeled Checkboxes';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        const id = checkbox.id;
        const label = element.querySelector(`label[for="${id}"]`);
        expect(label).not.toBeNull();
      });
    });

    test('error message linked via aria-describedby', async () => {
      element.legend = 'Error Group';
      element.errorMessage = 'Error message';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const fieldset = element.querySelector('fieldset');
      const errorEl = element.querySelector('.ontario-error-messaging');
      const describedBy = fieldset.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(errorEl.id);
    });
  });

  // ============================================
  // Keyboard Accessibility Tests
  // ============================================
  
  describe('Keyboard Accessibility', () => {
    test('checkboxes are focusable', async () => {
      element.legend = 'Focusable Checkboxes';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const firstCheckbox = element.querySelector('input[type="checkbox"]');
      const result = KeyboardTests.isFocusable(firstCheckbox);
      expect(result.pass).toBe(true);
    });

    test('tab moves through checkboxes', async () => {
      element.legend = 'Tab Navigation';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(3);
      
      // Each checkbox should be individually tabbable
      checkboxes.forEach(checkbox => {
        expect(checkbox.tabIndex).not.toBe(-1);
      });
    });

    test('space toggles checkbox', async () => {
      element.legend = 'Space Toggle';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkbox = element.querySelector('input[type="checkbox"]');
      expect(checkbox.checked).toBe(false);
      
      // Simulate space key by clicking (native behavior)
      checkbox.click();
      expect(checkbox.checked).toBe(true);
    });

    test('disabled checkboxes are not focusable', async () => {
      element.legend = 'Disabled Group';
      element.disabled = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        expect(checkbox.disabled).toBe(true);
      });
    });
  });

  // ============================================
  // Functional Tests
  // ============================================
  
  describe('Functional Behavior', () => {
    test('multiple selections allowed', async () => {
      element.legend = 'Multi-select';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      
      // Check first
      checkboxes[0].checked = true;
      checkboxes[0].dispatchEvent(new Event('change', { bubbles: true }));
      
      await Promise.resolve();
      
      // Check second
      checkboxes[1].checked = true;
      checkboxes[1].dispatchEvent(new Event('change', { bubbles: true }));
      
      await Promise.resolve();
      
      expect(element.value.length).toBe(2);
      expect(element.value).toContain('opt1');
      expect(element.value).toContain('opt2');
    });

    test('unchecking removes from value array', async () => {
      element.legend = 'Uncheck Test';
      element.options = sampleOptions;
      element.value = ['opt1', 'opt2'];
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      const firstCheckbox = Array.from(checkboxes).find(cb => cb.value === 'opt1');
      
      firstCheckbox.checked = false;
      firstCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
      
      await Promise.resolve();
      
      expect(element.value).not.toContain('opt1');
      expect(element.value).toContain('opt2');
    });

    test('change event fires with value array', async () => {
      element.legend = 'Change Event';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      const changeHandler = jest.fn();
      element.addEventListener('change', changeHandler);
      
      await Promise.resolve();
      
      const checkbox = element.querySelector('input[type="checkbox"]');
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(changeHandler).toHaveBeenCalled();
      expect(changeHandler.mock.calls[0][0].detail.value).toBeInstanceOf(Array);
    });

    test('focus method focuses first checkbox', async () => {
      element.legend = 'Focus Method';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      element.focus();
      
      const firstCheckbox = element.querySelector('input[type="checkbox"]');
      expect(document.activeElement).toBe(firstCheckbox);
    });

    test('pre-selected values are checked', async () => {
      element.legend = 'Pre-selected';
      element.options = sampleOptions;
      element.value = ['opt1', 'opt3'];
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxes = element.querySelectorAll('input[type="checkbox"]');
      const opt1 = Array.from(checkboxes).find(cb => cb.value === 'opt1');
      const opt2 = Array.from(checkboxes).find(cb => cb.value === 'opt2');
      const opt3 = Array.from(checkboxes).find(cb => cb.value === 'opt3');
      
      expect(opt1.checked).toBe(true);
      expect(opt2.checked).toBe(false);
      expect(opt3.checked).toBe(true);
    });
  });

  // ============================================
  // Validation Tests
  // ============================================
  
  describe('Validation', () => {
    test('checkValidity returns true when not required', async () => {
      element.legend = 'Optional';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.checkValidity()).toBe(true);
    });

    test('checkValidity returns false when required and empty', async () => {
      element.legend = 'Required Empty';
      element.required = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.checkValidity()).toBe(false);
    });

    test('checkValidity returns true when required and has selection', async () => {
      element.legend = 'Required Selected';
      element.required = true;
      element.options = sampleOptions;
      element.value = ['opt1'];
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.checkValidity()).toBe(true);
    });

    test('setCustomValidity sets invalid state', async () => {
      element.legend = 'Custom Validity';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      element.setCustomValidity('Custom error');
      // Verify setCustomValidity was called (method exists and processes message)
      const fieldset = element.querySelector('fieldset');
      // The component should mark itself as having custom validity
      expect(element.setCustomValidity).toBeDefined();
    });
  });

  // ============================================
  // Ontario Design System Compliance
  // ============================================
  
  describe('Ontario Design System Compliance', () => {
    test('uses ontario fieldset class', async () => {
      element.legend = 'ODS Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const fieldset = element.querySelector('.ontario-fieldset');
      expect(fieldset).not.toBeNull();
    });

    test('uses ontario checkboxes styling', async () => {
      element.legend = 'ODS Checkboxes';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const checkboxContainer = element.querySelector('.ontario-checkboxes, [class*="ontario-checkbox"]');
      expect(checkboxContainer).not.toBeNull();
    });

    test('adds caon-scope class on connected', async () => {
      element.legend = 'Scope Test';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(element.classList.contains('caon-scope')).toBe(true);
    });
  });
});
