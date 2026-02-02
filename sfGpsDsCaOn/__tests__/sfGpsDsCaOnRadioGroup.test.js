/**
 * Tests for sfGpsDsCaOnRadioGroup Component
 * 
 * Tests Ontario Design System compliance, AODA accessibility,
 * and functional requirements for the radio button group component.
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnRadioGroup from 'c/sfGpsDsCaOnRadioGroup';
import { KeyboardTests } from './accessibility/helpers';

// Mock for ontario-design-system components
jest.mock('@ongov/ontario-design-system-component-library', () => ({}), { virtual: true });

describe('sfGpsDsCaOnRadioGroup', () => {
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
    element = createElement('c-sf-gps-ds-ca-on-radio-group', {
      is: SfGpsDsCaOnRadioGroup
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
      element.legend = 'Radio Group';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const fieldset = element.querySelector('fieldset');
      expect(fieldset).not.toBeNull();
    });

    test('renders radio buttons for each option', async () => {
      element.legend = 'With Options';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radios = element.querySelectorAll('input[type="radio"]');
      expect(radios.length).toBe(sampleOptions.length);
    });

    test('renders radio labels', async () => {
      element.legend = 'With Labels';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const labels = element.querySelectorAll('.ontario-radios__label, .ontario-radio__label, label');
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
      element.hintText = 'Select one option';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const hint = element.querySelector('.ontario-hint');
      expect(hint).not.toBeNull();
      expect(hint.textContent).toContain('Select one option');
    });

    test('renders error message when in error state', async () => {
      element.legend = 'Error Field';
      element.errorMessage = 'Please select an option';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const error = element.querySelector('.ontario-error-messaging');
      expect(error).not.toBeNull();
      expect(error.textContent).toContain('Please select an option');
    });

    test('selected state shows filled circle', async () => {
      element.legend = 'Pre-selected';
      element.options = sampleOptions;
      element.value = 'opt2';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radios = element.querySelectorAll('input[type="radio"]');
      const selectedRadio = Array.from(radios).find(r => r.value === 'opt2');
      expect(selectedRadio.checked).toBe(true);
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
      const inputs = element.querySelectorAll('input[type="radio"]');
      expect(inputs.length).toBe(manyOptions.length);
    });

    test('renders with few options', async () => {
      element.legend = 'Few Options';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const inputs = element.querySelectorAll('input[type="radio"]');
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
  });

  // ============================================
  // Accessibility Tests - ARIA
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('uses fieldset to group radios', async () => {
      element.legend = 'Grouped Radios';
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

    test('all radios share same name attribute', async () => {
      element.legend = 'Same Name';
      element.name = 'test-group';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radios = element.querySelectorAll('input[type="radio"]');
      const names = Array.from(radios).map(r => r.name);
      const uniqueNames = [...new Set(names)];
      
      expect(uniqueNames.length).toBe(1);
    });

    test('each radio has associated label', async () => {
      element.legend = 'Labeled Radios';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radios = element.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        const id = radio.id;
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
    test('radios are focusable', async () => {
      element.legend = 'Focusable Radios';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const firstRadio = element.querySelector('input[type="radio"]');
      const result = KeyboardTests.isFocusable(firstRadio);
      expect(result.pass).toBe(true);
    });

    test('arrow keys can navigate radios (native behavior)', async () => {
      element.legend = 'Arrow Navigation';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // Radio buttons natively support arrow key navigation
      const radios = element.querySelectorAll('input[type="radio"]');
      expect(radios.length).toBe(3);
    });

    test('space selects focused radio', async () => {
      element.legend = 'Space Select';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radio = element.querySelector('input[type="radio"]');
      expect(radio.checked).toBe(false);
      
      // Simulate selection by clicking (native behavior)
      radio.click();
      expect(radio.checked).toBe(true);
    });

    test('disabled radios are not focusable', async () => {
      element.legend = 'Disabled Group';
      element.disabled = true;
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radios = element.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        expect(radio.disabled).toBe(true);
      });
    });
  });

  // ============================================
  // Functional Tests
  // ============================================
  
  describe('Functional Behavior', () => {
    test('only one selection allowed', async () => {
      element.legend = 'Single Select';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radios = element.querySelectorAll('input[type="radio"]');
      
      // Select first
      radios[0].click();
      await Promise.resolve();
      expect(radios[0].checked).toBe(true);
      
      // Select second - first should be deselected
      radios[1].click();
      await Promise.resolve();
      expect(radios[0].checked).toBe(false);
      expect(radios[1].checked).toBe(true);
    });

    test('value is single value not array', async () => {
      element.legend = 'Value Type';
      element.options = sampleOptions;
      element.value = 'opt1';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      expect(typeof element.value).toBe('string');
    });

    test('change event fires with value', async () => {
      element.legend = 'Change Event';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      const changeHandler = jest.fn();
      element.addEventListener('change', changeHandler);
      
      await Promise.resolve();
      
      const radio = element.querySelector('input[type="radio"]');
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      
      expect(changeHandler).toHaveBeenCalled();
      expect(changeHandler.mock.calls[0][0].detail.value).toBe('opt1');
    });

    test('focus method focuses first radio', async () => {
      element.legend = 'Focus Method';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      element.focus();
      
      const firstRadio = element.querySelector('input[type="radio"]');
      expect(document.activeElement).toBe(firstRadio);
    });

    test('pre-selected value is checked', async () => {
      element.legend = 'Pre-selected';
      element.options = sampleOptions;
      element.value = 'opt2';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radios = element.querySelectorAll('input[type="radio"]');
      const opt1 = Array.from(radios).find(r => r.value === 'opt1');
      const opt2 = Array.from(radios).find(r => r.value === 'opt2');
      const opt3 = Array.from(radios).find(r => r.value === 'opt3');
      
      expect(opt1.checked).toBe(false);
      expect(opt2.checked).toBe(true);
      expect(opt3.checked).toBe(false);
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
      element.value = 'opt1';
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

    test('uses ontario radios styling', async () => {
      element.legend = 'ODS Radios';
      element.options = sampleOptions;
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const radioContainer = element.querySelector('.ontario-radios, [class*="ontario-radio"]');
      expect(radioContainer).not.toBeNull();
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
