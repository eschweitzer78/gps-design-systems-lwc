/**
 * axe-core Configuration for Ontario Design System Accessibility Testing
 * 
 * This configuration sets up axe-core for WCAG 2.1 AA compliance testing,
 * aligned with AODA requirements.
 */

/**
 * Standard axe-core rules configuration for AODA/WCAG 2.1 AA
 * @type {Object}
 */
const axeConfig = {
  rules: {
    // WCAG 2.1 AA rules - all enabled
    'aria-allowed-attr': { enabled: true },
    'aria-hidden-body': { enabled: true },
    'aria-hidden-focus': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'button-name': { enabled: true },
    'color-contrast': { enabled: true },
    'document-title': { enabled: true },
    'duplicate-id': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'frame-title': { enabled: true },
    'html-has-lang': { enabled: true },
    'html-lang-valid': { enabled: true },
    'image-alt': { enabled: true },
    'input-button-name': { enabled: true },
    'input-image-alt': { enabled: true },
    'label': { enabled: true },
    'link-name': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    'meta-refresh': { enabled: true },
    'meta-viewport': { enabled: true },
    'object-alt': { enabled: true },
    'role-img-alt': { enabled: true },
    'scrollable-region-focusable': { enabled: true },
    'select-name': { enabled: true },
    'server-side-image-map': { enabled: true },
    'svg-img-alt': { enabled: true },
    'td-headers-attr': { enabled: true },
    'th-has-data-cells': { enabled: true },
    'valid-lang': { enabled: true },
    'video-caption': { enabled: true },
    
    // Additional best practices for Ontario DS
    'autocomplete-valid': { enabled: true },
    'avoid-inline-spacing': { enabled: true },
    'empty-heading': { enabled: true },
    'empty-table-header': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'heading-order': { enabled: true },
    'label-title-only': { enabled: true },
    'landmark-banner-is-top-level': { enabled: true },
    'landmark-complementary-is-top-level': { enabled: true },
    'landmark-contentinfo-is-top-level': { enabled: true },
    'landmark-main-is-top-level': { enabled: true },
    'landmark-no-duplicate-banner': { enabled: true },
    'landmark-no-duplicate-contentinfo': { enabled: true },
    'landmark-no-duplicate-main': { enabled: true },
    'landmark-one-main': { enabled: true },
    'landmark-unique': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
    'skip-link': { enabled: true },
    'tabindex': { enabled: true },
    'table-duplicate-name': { enabled: true }
  }
};

/**
 * WCAG 2.1 AA tags for axe-core
 * @type {string[]}
 */
const wcag21AATags = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'best-practice'
];

/**
 * Run axe accessibility test on an element
 * @param {HTMLElement} element - Element to test
 * @param {Object} options - Additional axe options
 * @returns {Promise<Object>} axe results
 */
async function runAxe(element, options = {}) {
  const axe = require('axe-core');
  
  const config = {
    ...axeConfig,
    ...options,
    runOnly: {
      type: 'tag',
      values: wcag21AATags
    }
  };
  
  return axe.run(element, config);
}

/**
 * Format axe violations for test output
 * @param {Array} violations - axe violations array
 * @returns {string} Formatted violations string
 */
function formatViolations(violations) {
  if (!violations || violations.length === 0) {
    return 'No accessibility violations found';
  }
  
  return violations.map(violation => {
    const nodes = violation.nodes.map(node => {
      return `    - ${node.html}\n      Fix: ${node.failureSummary}`;
    }).join('\n');
    
    return `
[${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}
  WCAG: ${violation.tags.filter(t => t.startsWith('wcag')).join(', ')}
  Help: ${violation.helpUrl}
  Affected elements:
${nodes}`;
  }).join('\n');
}

/**
 * Jest expect extension for axe accessibility
 * Usage: expect(element).toBeAccessible()
 */
function toBeAccessible(received) {
  const axe = require('axe-core');
  
  return new Promise((resolve) => {
    axe.run(received, {
      ...axeConfig,
      runOnly: { type: 'tag', values: wcag21AATags }
    }).then(results => {
      const violations = results.violations;
      const pass = violations.length === 0;
      
      resolve({
        pass,
        message: () => pass
          ? 'Expected element to have accessibility violations'
          : `Expected element to be accessible but found:\n${formatViolations(violations)}`
      });
    });
  });
}

module.exports = {
  axeConfig,
  wcag21AATags,
  runAxe,
  formatViolations,
  toBeAccessible
};
