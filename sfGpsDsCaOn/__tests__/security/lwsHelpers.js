/**
 * Lightning Web Security (LWS) Test Helpers
 * 
 * Provides utilities for testing LWS compliance in LWC components.
 * Tests for common antipatterns that cause security issues.
 */

/**
 * Patterns that indicate potential LWS violations
 * @type {Object}
 */
const LWS_ANTIPATTERNS = {
  // JavaScript sandbox violations
  WINDOW_TOP: /window\.top(?!\w)/,
  WINDOW_PARENT: /window\.parent(?!\w)/,
  WINDOW_OPENER: /window\.opener(?!\w)/,
  
  // Dynamic code execution
  EVAL: /\beval\s*\(/,
  FUNCTION_CONSTRUCTOR: /new\s+Function\s*\(/,
  
  // DOM manipulation
  DOCUMENT_WRITE: /document\.write\s*\(/,
  INNER_HTML: /\.innerHTML\s*=/,
  OUTER_HTML: /\.outerHTML\s*=/,
  INSERT_ADJACENT_HTML: /\.insertAdjacentHTML\s*\(/,
  
  // Prototype pollution
  PROTOTYPE_OVERRIDE: /\.prototype\s*\.\s*\w+\s*=/,
  
  // Internal CSS tokens (fragile selectors)
  LWC_SCOPE_TOKEN: /lwc-[a-z0-9]+_[a-z0-9]+/,
  COMPONENT_SCOPE_TOKEN: /c-\w+_\w+/
};

/**
 * CSS style patterns that need validation
 * @type {Object}
 */
const STYLE_PATTERNS = {
  // Safe CSS width values
  SAFE_WIDTH: /^width:\s*\d+(\.\d+)?(px|%|rem|em|vw|vh)$/i,
  // Safe CSS height values
  SAFE_HEIGHT: /^height:\s*\d+(\.\d+)?(px|%|rem|em|vw|vh)$/i,
  // Safe CSS margin/padding values
  SAFE_SPACING: /^(margin|padding)(-\w+)?:\s*\d+(\.\d+)?(px|%|rem|em)$/i,
  // Potentially unsafe - contains url() or expression()
  UNSAFE_EXPRESSION: /(url\s*\(|expression\s*\(|javascript:)/i
};

/**
 * LWS Security Tests
 */
const LWSTests = {
  /**
   * Check source code for eval() usage
   * @param {string} sourceCode - JavaScript source code
   * @returns {Object} Test result
   */
  hasNoEval(sourceCode) {
    const match = sourceCode.match(LWS_ANTIPATTERNS.EVAL);
    // Exclude comments that mention "no eval"
    const inComment = match && /\/\/.*eval|\/\*.*eval.*\*\//i.test(
      sourceCode.substring(Math.max(0, match.index - 50), match.index + 50)
    );
    
    return {
      pass: !match || inComment,
      message: match && !inComment
        ? `Found eval() usage at position ${match.index}`
        : 'No eval() usage found'
    };
  },
  
  /**
   * Check source code for Function constructor usage
   * @param {string} sourceCode - JavaScript source code
   * @returns {Object} Test result
   */
  hasNoFunctionConstructor(sourceCode) {
    const match = sourceCode.match(LWS_ANTIPATTERNS.FUNCTION_CONSTRUCTOR);
    
    return {
      pass: !match,
      message: match
        ? `Found new Function() usage at position ${match.index}`
        : 'No Function constructor usage found'
    };
  },
  
  /**
   * Check source code for innerHTML assignment
   * @param {string} sourceCode - JavaScript source code
   * @returns {Object} Test result
   */
  hasNoInnerHTML(sourceCode) {
    const match = sourceCode.match(LWS_ANTIPATTERNS.INNER_HTML);
    
    return {
      pass: !match,
      message: match
        ? `Found innerHTML assignment at position ${match.index}`
        : 'No innerHTML assignment found'
    };
  },
  
  /**
   * Check source code for prototype modification
   * @param {string} sourceCode - JavaScript source code
   * @returns {Object} Test result
   */
  hasNoPrototypeModification(sourceCode) {
    const match = sourceCode.match(LWS_ANTIPATTERNS.PROTOTYPE_OVERRIDE);
    
    return {
      pass: !match,
      message: match
        ? `Found prototype modification at position ${match.index}`
        : 'No prototype modification found'
    };
  },
  
  /**
   * Check source code for document.write usage
   * @param {string} sourceCode - JavaScript source code
   * @returns {Object} Test result
   */
  hasNoDocumentWrite(sourceCode) {
    const match = sourceCode.match(LWS_ANTIPATTERNS.DOCUMENT_WRITE);
    
    return {
      pass: !match,
      message: match
        ? `Found document.write() usage at position ${match.index}`
        : 'No document.write() usage found'
    };
  },
  
  /**
   * Check if window.location usage has proper fallback
   * @param {string} sourceCode - JavaScript source code
   * @returns {Object} Test result
   */
  windowLocationHasFallback(sourceCode) {
    const windowLocationMatch = sourceCode.match(/window\.location/g);
    
    if (!windowLocationMatch) {
      return { pass: true, message: 'No window.location usage' };
    }
    
    // Check for try/catch or typeof check
    const hasFallback = 
      sourceCode.includes('typeof window') ||
      sourceCode.includes('try {') ||
      sourceCode.includes("if (typeof window !== 'undefined'") ||
      sourceCode.includes('if (typeof window !== "undefined"');
    
    return {
      pass: hasFallback,
      count: windowLocationMatch.length,
      message: hasFallback
        ? `window.location used ${windowLocationMatch.length} times with fallback`
        : `window.location used ${windowLocationMatch.length} times without fallback`
    };
  },
  
  /**
   * Check CSS for internal scope tokens
   * @param {string} cssCode - CSS source code
   * @returns {Object} Test result
   */
  hasNoInternalScopeTokens(cssCode) {
    const lwcMatch = cssCode.match(LWS_ANTIPATTERNS.LWC_SCOPE_TOKEN);
    const compMatch = cssCode.match(LWS_ANTIPATTERNS.COMPONENT_SCOPE_TOKEN);
    
    const found = [];
    if (lwcMatch) found.push(lwcMatch[0]);
    if (compMatch) found.push(compMatch[0]);
    
    return {
      pass: found.length === 0,
      tokens: found,
      message: found.length === 0
        ? 'No internal CSS scope tokens found'
        : `Found internal scope tokens: ${found.join(', ')}`
    };
  },
  
  /**
   * Run all LWS security checks on source code
   * @param {string} sourceCode - JavaScript source code
   * @returns {Object} Combined test results
   */
  runAllChecks(sourceCode) {
    const results = {
      eval: this.hasNoEval(sourceCode),
      functionConstructor: this.hasNoFunctionConstructor(sourceCode),
      innerHTML: this.hasNoInnerHTML(sourceCode),
      prototype: this.hasNoPrototypeModification(sourceCode),
      documentWrite: this.hasNoDocumentWrite(sourceCode),
      windowLocation: this.windowLocationHasFallback(sourceCode)
    };
    
    const failures = Object.entries(results)
      .filter(([, result]) => !result.pass)
      .map(([name, result]) => `${name}: ${result.message}`);
    
    return {
      pass: failures.length === 0,
      results,
      failures,
      message: failures.length === 0
        ? 'All LWS security checks passed'
        : `LWS violations found:\n${failures.join('\n')}`
    };
  }
};

/**
 * Style Sanitization Tests
 */
const StyleTests = {
  /**
   * Check if style value is safe
   * @param {string} styleValue - CSS style value
   * @returns {Object} Test result
   */
  isSafeStyleValue(styleValue) {
    if (!styleValue || typeof styleValue !== 'string') {
      return { pass: true, message: 'No style value' };
    }
    
    // Check for unsafe patterns
    const unsafeMatch = styleValue.match(STYLE_PATTERNS.UNSAFE_EXPRESSION);
    if (unsafeMatch) {
      return {
        pass: false,
        pattern: unsafeMatch[0],
        message: `Unsafe pattern found: ${unsafeMatch[0]}`
      };
    }
    
    // Check if it matches safe patterns
    const isSafeWidth = STYLE_PATTERNS.SAFE_WIDTH.test(styleValue);
    const isSafeHeight = STYLE_PATTERNS.SAFE_HEIGHT.test(styleValue);
    const isSafeSpacing = STYLE_PATTERNS.SAFE_SPACING.test(styleValue);
    
    const isSafe = isSafeWidth || isSafeHeight || isSafeSpacing;
    
    return {
      pass: isSafe,
      value: styleValue,
      message: isSafe
        ? `Style value "${styleValue}" is safe`
        : `Style value "${styleValue}" should be validated`
    };
  },
  
  /**
   * Check if element has sanitized style binding
   * @param {HTMLElement} element - Element to check
   * @returns {Object} Test result
   */
  hasSanitizedStyleBinding(element) {
    const style = element.getAttribute('style');
    return this.isSafeStyleValue(style);
  }
};

/**
 * Apex Security Tests (for checking controller patterns)
 */
const ApexPatterns = {
  /**
   * Check if Apex class uses "with sharing"
   * @param {string} apexCode - Apex source code
   * @returns {Object} Test result
   */
  usesWithSharing(apexCode) {
    const hasWithSharing = /with\s+sharing/.test(apexCode);
    const hasWithoutSharing = /without\s+sharing/.test(apexCode);
    
    return {
      pass: hasWithSharing && !hasWithoutSharing,
      hasWithSharing,
      hasWithoutSharing,
      message: hasWithSharing && !hasWithoutSharing
        ? 'Class uses "with sharing"'
        : hasWithoutSharing
          ? 'Class uses "without sharing" - review security'
          : 'Class does not specify sharing mode'
    };
  },
  
  /**
   * Check for SOQL injection vulnerabilities
   * @param {string} apexCode - Apex source code
   * @returns {Object} Test result
   */
  hasNoSoqlInjection(apexCode) {
    // Check for string concatenation in SOQL
    const unsafePattern = /\[\s*SELECT[^;]*\+[^;]*\]/i;
    const match = apexCode.match(unsafePattern);
    
    // Check if escapeSingleQuotes is used
    const usesEscape = apexCode.includes('escapeSingleQuotes');
    
    return {
      pass: !match || usesEscape,
      usesEscape,
      message: match && !usesEscape
        ? 'Potential SOQL injection - use escapeSingleQuotes'
        : 'No SOQL injection vulnerabilities found'
    };
  }
};

/**
 * Create a Jest test suite for LWS compliance
 * @param {string} componentName - Name of component
 * @param {string} sourceCode - Component source code
 * @returns {Function} Jest describe function
 */
function createLWSTestSuite(componentName, sourceCode) {
  return () => {
    describe(`${componentName} LWS Compliance`, () => {
      it('should not use eval()', () => {
        const result = LWSTests.hasNoEval(sourceCode);
        expect(result.pass).toBe(true);
      });
      
      it('should not use Function constructor', () => {
        const result = LWSTests.hasNoFunctionConstructor(sourceCode);
        expect(result.pass).toBe(true);
      });
      
      it('should not use innerHTML', () => {
        const result = LWSTests.hasNoInnerHTML(sourceCode);
        expect(result.pass).toBe(true);
      });
      
      it('should not modify prototypes', () => {
        const result = LWSTests.hasNoPrototypeModification(sourceCode);
        expect(result.pass).toBe(true);
      });
      
      it('should not use document.write()', () => {
        const result = LWSTests.hasNoDocumentWrite(sourceCode);
        expect(result.pass).toBe(true);
      });
      
      it('should have fallback for window.location if used', () => {
        const result = LWSTests.windowLocationHasFallback(sourceCode);
        expect(result.pass).toBe(true);
      });
    });
  };
}

module.exports = {
  LWS_ANTIPATTERNS,
  STYLE_PATTERNS,
  LWSTests,
  StyleTests,
  ApexPatterns,
  createLWSTestSuite
};
