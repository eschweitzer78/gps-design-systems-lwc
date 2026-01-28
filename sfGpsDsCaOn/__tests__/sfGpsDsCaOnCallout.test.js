/**
 * @description Unit, accessibility, and Ontario DS compliance tests for sfGpsDsCaOnCallout
 * 
 * Tests cover:
 * - WCAG 2.1 AA accessibility compliance (AODA requirements)
 * - Ontario Design System callout patterns
 * - Type variants (default, information, warning, error, success)
 * - Screen reader announcements
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnCallout from 'c/sfGpsDsCaOnCallout';
import { runAxe, formatViolations } from './accessibility/axeConfig';
import { AriaTests, LiveRegionTests } from './accessibility/helpers';

describe('sfGpsDsCaOnCallout', () => {
  let element;

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-callout', {
      is: SfGpsDsCaOnCallout
    });
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('Rendering', () => {
    it('should render default callout', () => {
      document.body.appendChild(element);
      
      const section = element.querySelector('section.ontario-callout');
      expect(section).not.toBeNull();
    });

    it('should render with heading', async () => {
      element.heading = 'Important Notice';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const heading = element.querySelector('.ontario-callout__heading');
      expect(heading).not.toBeNull();
      expect(heading.textContent).toContain('Important Notice');
    });

    it('should render information type callout', async () => {
      element.type = 'information';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const callout = element.querySelector('.ontario-callout--information');
      expect(callout).not.toBeNull();
    });

    it('should render warning type callout', async () => {
      element.type = 'warning';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const callout = element.querySelector('.ontario-callout--warning');
      expect(callout).not.toBeNull();
    });

    it('should render error type callout', async () => {
      element.type = 'error';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const callout = element.querySelector('.ontario-callout--error');
      expect(callout).not.toBeNull();
    });

    it('should render success type callout', async () => {
      element.type = 'success';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const callout = element.querySelector('.ontario-callout--success');
      expect(callout).not.toBeNull();
    });

    it('should render icon for typed callouts', async () => {
      element.type = 'warning';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.ontario-callout__icon');
      expect(icon).not.toBeNull();
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    it('should not render icon for default callout', async () => {
      element.type = 'default';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.ontario-callout__icon');
      expect(icon).toBeNull();
    });
  });

  describe('Heading Levels', () => {
    const headingLevels = ['h2', 'h3', 'h4', 'h5', 'h6'];

    headingLevels.forEach(level => {
      it(`should render ${level} heading`, async () => {
        element.heading = 'Test Heading';
        element.headingLevel = level;
        document.body.appendChild(element);
        
        await Promise.resolve();
        
        const heading = element.querySelector(level);
        expect(heading).not.toBeNull();
        expect(heading.textContent).toContain('Test Heading');
      });
    });
  });

  describe('Highlight Colors (Default Type)', () => {
    const colors = ['blue', 'gold', 'green', 'teal', 'purple'];

    colors.forEach(color => {
      it(`should apply ${color} highlight color`, async () => {
        element.type = 'default';
        element.highlightColour = color;
        document.body.appendChild(element);
        
        await Promise.resolve();
        
        const callout = element.querySelector('.ontario-callout');
        expect(callout.classList.contains(`ontario-callout--${color}`)).toBe(true);
      });
    });
  });

  describe('Accessibility - WCAG 2.1 AA', () => {
    
    it('should have role="note" on section', async () => {
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const section = element.querySelector('section');
      expect(section.getAttribute('role')).toBe('note');
    });

    it('should have aria-live="polite" for announcements', async () => {
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const section = element.querySelector('section');
      expect(section.getAttribute('aria-live')).toBe('polite');
    });

    it('should hide decorative icons from screen readers', async () => {
      element.type = 'information';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.ontario-callout__icon');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('focusable')).toBe('false');
    });

    it('should pass axe accessibility audit - default type', async () => {
      element.heading = 'Accessibility Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const results = await runAxe(element);
      expect(results.violations).toHaveLength(0);
    });

    it('should pass axe accessibility audit - warning type', async () => {
      element.type = 'warning';
      element.heading = 'Warning Callout';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const results = await runAxe(element);
      expect(results.violations).toHaveLength(0);
    });

    it('should pass axe accessibility audit - error type', async () => {
      element.type = 'error';
      element.heading = 'Error Callout';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const results = await runAxe(element);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should not have focusable decorative elements', async () => {
      element.type = 'information';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.ontario-callout__icon');
      expect(icon.getAttribute('focusable')).toBe('false');
    });

    it('should allow links within content to receive focus', async () => {
      element.innerHTML = '<a href="#">Learn more</a>';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const link = element.querySelector('a');
      expect(link).not.toBeNull();
      
      // Verify link is focusable
      link.focus();
      expect(document.activeElement).toBe(link);
    });
  });

  describe('Ontario Design System Compliance', () => {
    it('should have ontario-callout base class', async () => {
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const callout = element.querySelector('.ontario-callout');
      expect(callout).not.toBeNull();
    });

    it('should apply typed class for information type', async () => {
      element.type = 'information';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const callout = element.querySelector('.ontario-callout');
      expect(callout.classList.contains('ontario-callout--typed')).toBe(true);
      expect(callout.classList.contains('ontario-callout--information')).toBe(true);
    });

    it('should wrap content in div for typed callouts', async () => {
      element.type = 'warning';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const contentWrapper = element.querySelector('.ontario-callout__content');
      expect(contentWrapper).not.toBeNull();
    });
  });

  describe('Live Region Tests', () => {
    it('should be a live region', async () => {
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const section = element.querySelector('section');
      const result = LiveRegionTests.isLiveRegion(section);
      expect(result.pass).toBe(true);
    });

    it('should have polite politeness level', async () => {
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const section = element.querySelector('section');
      const result = LiveRegionTests.hasCorrectPoliteness(section, 'polite');
      expect(result.pass).toBe(true);
    });
  });
});
