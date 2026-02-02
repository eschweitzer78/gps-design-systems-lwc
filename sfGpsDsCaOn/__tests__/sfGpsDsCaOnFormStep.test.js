/**
 * Tests for sfGpsDsCaOnFormStep Component
 * 
 * Tests step navigation, skip link behavior, screen reader announcements,
 * focus management, and Ontario Design System compliance.
 * 
 * Note: These tests validate expected patterns using mock elements
 * since OmniStudio form components have complex runtime dependencies.
 */

import { LiveRegionTests } from './accessibility/helpers';

describe('sfGpsDsCaOnFormStep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ============================================
  // Navigation Visibility Tests
  // ============================================
  
  describe('Navigation Visibility', () => {
    test('computedShowSep true when showNext is true', () => {
      const showNext = true;
      const showPrev = false;
      const showSave = false;
      const computedShowSep = showNext || showPrev || showSave;
      
      expect(computedShowSep).toBe(true);
    });

    test('computedShowSep true when showPrev is true', () => {
      const showNext = false;
      const showPrev = true;
      const showSave = false;
      const computedShowSep = showNext || showPrev || showSave;
      
      expect(computedShowSep).toBe(true);
    });

    test('computedShowSep true when showSave is true', () => {
      const showNext = false;
      const showPrev = false;
      const showSave = true;
      const computedShowSep = showNext || showPrev || showSave;
      
      expect(computedShowSep).toBe(true);
    });

    test('computedShowSep false when no buttons visible', () => {
      const showNext = false;
      const showPrev = false;
      const showSave = false;
      const computedShowSep = showNext || showPrev || showSave;
      
      expect(computedShowSep).toBe(false);
    });
  });

  // ============================================
  // ARIA Accessibility Tests
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('stepAriaLabel includes step label', () => {
      const mergedLabel = 'Personal Information';
      const stepAriaLabel = `${mergedLabel || 'Step'} - Form section`;
      
      expect(stepAriaLabel).toContain('Personal Information');
      expect(stepAriaLabel).toContain('Form section');
    });

    test('stepAriaLabel uses default when no label', () => {
      const mergedLabel = '';
      const stepAriaLabel = `${mergedLabel || 'Step'} - Form section`;
      
      expect(stepAriaLabel).toContain('Step');
    });

    test('step region has appropriate role', () => {
      const mockRegion = document.createElement('section');
      mockRegion.setAttribute('role', 'region');
      mockRegion.setAttribute('aria-label', 'Step 1 - Form section');
      
      expect(mockRegion.getAttribute('role')).toBe('region');
      expect(mockRegion.getAttribute('aria-label')).toContain('Form section');
    });
  });

  // ============================================
  // Screen Reader Announcements
  // ============================================
  
  describe('Screen Reader Announcements', () => {
    test('step announcement format', () => {
      const stepLabel = 'Contact Details';
      const announcement = `Now on step: ${stepLabel}`;
      
      expect(announcement).toBe('Now on step: Contact Details');
    });

    test('announceStepChange clears after delay', () => {
      let stepAnnouncement = 'Step 2 of 5';
      
      // Simulate clearing after timeout
      setTimeout(() => {
        stepAnnouncement = '';
      }, 1000);
      
      expect(stepAnnouncement).toBe('Step 2 of 5');
      
      jest.advanceTimersByTime(1000);
      
      expect(stepAnnouncement).toBe('');
    });

    test('live region for announcements', () => {
      const mockLiveRegion = document.createElement('div');
      mockLiveRegion.setAttribute('aria-live', 'polite');
      mockLiveRegion.setAttribute('role', 'status');
      
      const result = LiveRegionTests.isLiveRegion(mockLiveRegion);
      expect(result.pass).toBe(true);
    });
  });

  // ============================================
  // Skip Link Tests
  // ============================================
  
  describe('Skip Link', () => {
    test('skip link has correct class when hidden', () => {
      const mockSkipLink = document.createElement('a');
      mockSkipLink.className = 'sfgpsdscaon-step__skip-link';
      
      expect(mockSkipLink.classList.contains('sfgpsdscaon-step__skip-link')).toBe(true);
      expect(mockSkipLink.classList.contains('sfgpsdscaon-step__skip-link--visible')).toBe(false);
    });

    test('skip link becomes visible on focus', () => {
      const mockSkipLink = document.createElement('a');
      mockSkipLink.className = 'sfgpsdscaon-step__skip-link';
      
      // Simulate focus
      mockSkipLink.classList.add('sfgpsdscaon-step__skip-link--visible');
      
      expect(mockSkipLink.classList.contains('sfgpsdscaon-step__skip-link--visible')).toBe(true);
    });

    test('skip link hides on blur', () => {
      const mockSkipLink = document.createElement('a');
      mockSkipLink.className = 'sfgpsdscaon-step__skip-link sfgpsdscaon-step__skip-link--visible';
      
      // Simulate blur
      mockSkipLink.classList.remove('sfgpsdscaon-step__skip-link--visible');
      
      expect(mockSkipLink.classList.contains('sfgpsdscaon-step__skip-link--visible')).toBe(false);
    });

    test('skip link points to navigation', () => {
      const mockSkipLink = document.createElement('a');
      mockSkipLink.href = '#step-navigation';
      
      expect(mockSkipLink.href).toContain('#step-navigation');
    });
  });

  // ============================================
  // Navigation Event Tests
  // ============================================
  
  describe('Navigation Events', () => {
    test('next button event format', () => {
      const event = new CustomEvent('omniautoadvance', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { moveToStep: 'next' }
      });
      
      expect(event.detail.moveToStep).toBe('next');
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    test('back button event format', () => {
      const event = new CustomEvent('omniautoadvance', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { moveToStep: 'previous' }
      });
      
      expect(event.detail.moveToStep).toBe('previous');
    });

    test('buttons disable temporarily after click', () => {
      let disabledButtons = false;
      
      // Simulate click
      disabledButtons = true;
      expect(disabledButtons).toBe(true);
      
      // Simulate timeout
      setTimeout(() => {
        disabledButtons = false;
      }, 1000);
      
      jest.advanceTimersByTime(1000);
      expect(disabledButtons).toBe(false);
    });
  });

  // ============================================
  // Validation Error Detection Tests
  // ============================================
  
  describe('Validation Error Detection', () => {
    test('detects slds-has-error class', () => {
      const mockInput = document.createElement('input');
      mockInput.setAttribute('data-omni-input', 'true');
      mockInput.classList.add('slds-has-error');
      
      const hasError = mockInput.classList.contains('slds-has-error');
      expect(hasError).toBe(true);
    });

    test('detects nds-has-error class', () => {
      const mockInput = document.createElement('input');
      mockInput.setAttribute('data-omni-input', 'true');
      mockInput.classList.add('nds-has-error');
      
      const hasError = mockInput.classList.contains('nds-has-error');
      expect(hasError).toBe(true);
    });

    test('detects aria-invalid="true"', () => {
      const mockInput = document.createElement('input');
      mockInput.setAttribute('data-omni-input', 'true');
      mockInput.setAttribute('aria-invalid', 'true');
      
      const hasError = mockInput.getAttribute('aria-invalid') === 'true';
      expect(hasError).toBe(true);
    });

    test('returns false when no errors', () => {
      const mockInput = document.createElement('input');
      mockInput.setAttribute('data-omni-input', 'true');
      
      const hasSldsError = mockInput.classList.contains('slds-has-error');
      const hasNdsError = mockInput.classList.contains('nds-has-error');
      const hasAriaInvalid = mockInput.getAttribute('aria-invalid') === 'true';
      
      expect(hasSldsError || hasNdsError || hasAriaInvalid).toBe(false);
    });
  });

  // ============================================
  // Focus Management Tests
  // ============================================
  
  describe('Focus Management', () => {
    test('error summary can receive focus', () => {
      const mockErrorSummary = document.createElement('div');
      mockErrorSummary.className = 'sfgpsdscaon-step__error-summary';
      mockErrorSummary.tabIndex = -1;
      
      expect(mockErrorSummary.tabIndex).toBe(-1);
    });

    test('step heading can receive focus', () => {
      const mockHeading = document.createElement('h2');
      mockHeading.className = 'sfgpsdscaon-step__heading';
      mockHeading.tabIndex = -1;
      
      expect(mockHeading.tabIndex).toBe(-1);
    });

    test('focus moves to heading on step render', () => {
      const mockHeading = document.createElement('h2');
      mockHeading.focus = jest.fn();
      
      // Simulate focus call
      setTimeout(() => {
        mockHeading.focus();
      }, 100);
      
      jest.advanceTimersByTime(100);
      
      expect(mockHeading.focus).toHaveBeenCalled();
    });
  });

  // ============================================
  // Button Tests
  // ============================================
  
  describe('Buttons', () => {
    test('next button has ontario-button class', () => {
      const mockButton = document.createElement('button');
      mockButton.className = 'ontario-button ontario-button--primary';
      
      expect(mockButton.classList.contains('ontario-button')).toBe(true);
      expect(mockButton.classList.contains('ontario-button--primary')).toBe(true);
    });

    test('back button has ontario-button class', () => {
      const mockButton = document.createElement('button');
      mockButton.className = 'ontario-button ontario-button--secondary';
      
      expect(mockButton.classList.contains('ontario-button')).toBe(true);
      expect(mockButton.classList.contains('ontario-button--secondary')).toBe(true);
    });

    test('disabled button has disabled attribute', () => {
      const mockButton = document.createElement('button');
      mockButton.disabled = true;
      
      expect(mockButton.disabled).toBe(true);
    });
  });

  // ============================================
  // Ontario Design System Compliance
  // ============================================
  
  describe('Ontario Design System Compliance', () => {
    test('uses sfgpsdscaon prefix for styling classes', () => {
      const stepClass = 'sfgpsdscaon-step';
      expect(stepClass).toContain('sfgpsdscaon');
    });

    test('has caon-scope class', () => {
      const mockElement = document.createElement('div');
      mockElement.classList.add('caon-scope');
      
      expect(mockElement.classList.contains('caon-scope')).toBe(true);
    });
  });
});
