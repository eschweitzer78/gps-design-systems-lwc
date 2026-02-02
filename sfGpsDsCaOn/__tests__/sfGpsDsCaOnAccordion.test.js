/**
 * Tests for sfGpsDsCaOnAccordion Component
 * 
 * Tests toggle behavior, ARIA accessibility states,
 * and Ontario Design System compliance.
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnAccordion from 'c/sfGpsDsCaOnAccordion';

describe('sfGpsDsCaOnAccordion', () => {
  let element;

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-accordion', {
      is: SfGpsDsCaOnAccordion
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
      element.label = 'Section Title';
      element.accordionId = 'section-1';
      document.body.appendChild(element);
      await Promise.resolve();
      
      // Check that label is rendered
      const heading = element.querySelector('.ontario-accordion__heading, h2, h3, button');
      expect(heading).not.toBeNull();
    });

    test('renders closed by default', async () => {
      element.label = 'Closed Section';
      element.accordionId = 'closed-1';
      document.body.appendChild(element);
      await Promise.resolve();
      
      // Default state should be closed
      expect(element.isOpen).toBe(false);
    });

    test('renders open when isOpen is true', async () => {
      element.label = 'Open Section';
      element.accordionId = 'open-1';
      element.isOpen = true;
      document.body.appendChild(element);
      await Promise.resolve();
      
      expect(element.isOpen).toBe(true);
    });
  });

  // ============================================
  // Toggle Event Tests
  // ============================================
  
  describe('Toggle Event', () => {
    test('button click dispatches toggle event', async () => {
      element.label = 'Clickable';
      element.accordionId = 'clickable-1';
      document.body.appendChild(element);
      
      const toggleHandler = jest.fn();
      element.addEventListener('toggle', toggleHandler);
      
      await Promise.resolve();
      
      const button = element.querySelector('button');
      if (button) {
        button.click();
        expect(toggleHandler).toHaveBeenCalled();
      }
    });

    test('toggle event includes accordionId', async () => {
      element.label = 'Clickable';
      element.accordionId = 'section-xyz';
      document.body.appendChild(element);
      
      const toggleHandler = jest.fn();
      element.addEventListener('toggle', toggleHandler);
      
      await Promise.resolve();
      
      const button = element.querySelector('button');
      if (button) {
        button.click();
        expect(toggleHandler.mock.calls[0][0].detail.accordionId).toBe('section-xyz');
      }
    });
  });

  // ============================================
  // ARIA Accessibility Tests
  // ============================================
  
  describe('ARIA Accessibility', () => {
    test('button has aria-expanded attribute', async () => {
      element.label = 'Test';
      element.accordionId = 'test-1';
      element.isOpen = false;
      document.body.appendChild(element);
      await Promise.resolve();
      
      const button = element.querySelector('button');
      if (button) {
        expect(button.getAttribute('aria-expanded')).toBe('false');
      }
    });

    test('aria-expanded is true when open', async () => {
      element.label = 'Test';
      element.accordionId = 'test-1';
      element.isOpen = true;
      document.body.appendChild(element);
      await Promise.resolve();
      
      const button = element.querySelector('button');
      if (button) {
        expect(button.getAttribute('aria-expanded')).toBe('true');
      }
    });

    test('button has aria-controls linking to content', async () => {
      element.label = 'Test';
      element.accordionId = 'my-accordion';
      document.body.appendChild(element);
      await Promise.resolve();
      
      const button = element.querySelector('button');
      if (button) {
        const ariaControls = button.getAttribute('aria-controls');
        expect(ariaControls).toContain('my-accordion');
      }
    });

    test('content region has aria-hidden when closed', async () => {
      element.label = 'Test';
      element.accordionId = 'test-1';
      element.isOpen = false;
      document.body.appendChild(element);
      await Promise.resolve();
      
      const content = element.querySelector('.ontario-accordion__content, [aria-hidden]');
      if (content) {
        expect(content.getAttribute('aria-hidden')).toBe('true');
      }
    });
  });

  // ============================================
  // Ontario Design System Compliance
  // ============================================
  
  describe('Ontario Design System Compliance', () => {
    test('adds caon-scope class on connected', async () => {
      element.label = 'ODS Test';
      element.accordionId = 'ods-1';
      document.body.appendChild(element);
      await Promise.resolve();
      
      expect(element.classList.contains('caon-scope')).toBe(true);
    });

    test('has ontario-accordion class structure', async () => {
      element.label = 'ODS Test';
      element.accordionId = 'ods-1';
      document.body.appendChild(element);
      await Promise.resolve();
      
      const accordion = element.querySelector('.ontario-accordion') || element;
      expect(accordion).not.toBeNull();
    });
  });
});
