/**
 * @description Unit, accessibility, and Ontario DS compliance tests for sfGpsDsCaOnActionCard
 * 
 * Tests cover:
 * - WCAG 2.1 AA accessibility compliance (AODA requirements)
 * - Ontario Design System action card patterns
 * - Icon accessibility (decorative vs meaningful)
 * - Heading levels
 */

import { createElement } from 'lwc';
import SfGpsDsCaOnActionCard from 'c/sfGpsDsCaOnActionCard';
import { runAxe } from './accessibility/axeConfig';
import { AriaTests, KeyboardTests } from './accessibility/helpers';

describe('sfGpsDsCaOnActionCard', () => {
  let element;

  beforeEach(() => {
    element = createElement('c-sf-gps-ds-ca-on-action-card', {
      is: SfGpsDsCaOnActionCard
    });
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('Rendering', () => {
    it('should render action card', async () => {
      element.heading = 'Test Action Card';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const card = element.querySelector('.sfgpsdscaon-action-card');
      expect(card).not.toBeNull();
    });

    it('should render heading', async () => {
      element.heading = 'Apply for Permit';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const heading = element.querySelector('.sfgpsdscaon-action-card__heading');
      expect(heading.textContent).toBe('Apply for Permit');
    });

    it('should render description', async () => {
      element.heading = 'Test';
      element.description = 'This is a description';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const description = element.querySelector('.sfgpsdscaon-action-card__description');
      expect(description.textContent).toBe('This is a description');
    });

    it('should render primary button', async () => {
      element.heading = 'Test';
      element.buttonLabel = 'Get Started';
      element.buttonUrl = '/apply';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const button = element.querySelector('.sfgpsdscaon-action-card__button');
      expect(button).not.toBeNull();
      expect(button.textContent.trim()).toBe('Get Started');
      expect(button.getAttribute('href')).toBe('/apply');
    });
  });

  describe('Icon Accessibility (AODA Fix)', () => {
    it('should hide decorative icon from screen readers', async () => {
      element.heading = 'Test';
      element.icon = '/assets/icon.png';
      // No iconAltText = decorative
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.sfgpsdscaon-action-card__icon');
      expect(icon).not.toBeNull();
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('alt')).toBe('');
    });

    it('should expose meaningful icon to screen readers', async () => {
      element.heading = 'Test';
      element.icon = '/assets/icon.png';
      element.iconAltText = 'Permit application icon';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.sfgpsdscaon-action-card__icon');
      expect(icon).not.toBeNull();
      expect(icon.getAttribute('alt')).toBe('Permit application icon');
      expect(icon.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should not have conflicting alt and aria-hidden', async () => {
      element.heading = 'Test';
      element.icon = '/assets/icon.png';
      element.iconAltText = 'Meaningful text';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const icon = element.querySelector('.sfgpsdscaon-action-card__icon');
      
      // If alt text is provided, should NOT have aria-hidden
      if (icon.getAttribute('alt') && icon.getAttribute('alt') !== '') {
        expect(icon.hasAttribute('aria-hidden')).toBe(false);
      }
      
      // If aria-hidden, should have empty alt
      if (icon.getAttribute('aria-hidden') === 'true') {
        expect(icon.getAttribute('alt')).toBe('');
      }
    });
  });

  describe('Heading Levels', () => {
    it('should render h3 by default', async () => {
      element.heading = 'Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // ActionCard defaults to h3 (not h2)
      const h3 = element.querySelector('h3');
      expect(h3).not.toBeNull();
    });

    it('should render h2 when headingLevel is h2', async () => {
      element.heading = 'Test';
      element.headingLevel = 'h2';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const h2 = element.querySelector('h2');
      expect(h2).not.toBeNull();
    });

    it('should render h4 when headingLevel is h4', async () => {
      element.heading = 'Test';
      element.headingLevel = 'h4';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const h4 = element.querySelector('h4');
      expect(h4).not.toBeNull();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('primary button link should be focusable', async () => {
      element.heading = 'Test';
      element.buttonLabel = 'Apply';
      element.buttonUrl = '/apply';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const button = element.querySelector('.sfgpsdscaon-action-card__button');
      const result = KeyboardTests.isFocusable(button);
      expect(result.pass).toBe(true);
    });

    it('secondary link should be focusable', async () => {
      element.heading = 'Test';
      element.linkLabel = 'More info';
      element.linkUrl = '/info';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const link = element.querySelector('.sfgpsdscaon-action-card__link');
      const result = KeyboardTests.isFocusable(link);
      expect(result.pass).toBe(true);
    });
  });

  describe('Color Variants', () => {
    // Note: Property uses British spelling 'headerColour'
    const colors = ['dark-blue', 'blue', 'teal', 'green', 'gold', 'purple'];

    colors.forEach(color => {
      it(`should apply ${color} header variant`, async () => {
        element.heading = 'Test';
        element.headerColour = color; // British spelling
        document.body.appendChild(element);
        
        await Promise.resolve();
        
        const header = element.querySelector('.sfgpsdscaon-action-card__header');
        expect(header.classList.contains(`sfgpsdscaon-action-card__header--${color}`)).toBe(true);
      });
    });
  });

  describe('Accessibility Audit', () => {
    it('should pass axe audit with decorative icon', async () => {
      element.heading = 'Apply for Environmental Registration';
      element.description = 'Submit your application online';
      element.buttonLabel = 'Start Application';
      element.buttonUrl = '/apply';
      element.icon = '/assets/icon.png';
      // No iconAltText = decorative
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // Disable list-related rules since the li is standalone in test
      const results = await runAxe(element, {
        rules: {
          'listitem': { enabled: false } // li outside list in test context
        }
      });
      expect(results.violations).toHaveLength(0);
    });

    it('should pass axe audit with meaningful icon', async () => {
      element.heading = 'Apply for Environmental Registration';
      element.description = 'Submit your application online';
      element.buttonLabel = 'Start Application';
      element.buttonUrl = '/apply';
      element.icon = '/assets/icon.png';
      element.iconAltText = 'Environmental permit icon';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // Disable list-related rules since the li is standalone in test
      const results = await runAxe(element, {
        rules: {
          'listitem': { enabled: false } // li outside list in test context
        }
      });
      expect(results.violations).toHaveLength(0);
    });

    it('should pass axe audit without icon', async () => {
      element.heading = 'Apply for Environmental Registration';
      element.description = 'Submit your application online';
      element.buttonLabel = 'Start Application';
      element.buttonUrl = '/apply';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      // Disable list-related rules since the li is standalone in test
      const results = await runAxe(element, {
        rules: {
          'listitem': { enabled: false } // li outside list in test context
        }
      });
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('ARIA Attributes', () => {
    it('should be a list item (semantic structure)', async () => {
      element.heading = 'Test';
      document.body.appendChild(element);
      
      await Promise.resolve();
      
      const li = element.querySelector('li');
      expect(li).not.toBeNull();
    });
  });
});
