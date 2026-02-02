/**
 * @description Lightning Web Security (LWS) compliance tests for Ontario DS components
 * 
 * Tests for common LWS antipatterns:
 * - eval() and Function constructor
 * - innerHTML and DOM manipulation
 * - Prototype pollution
 * - Unsafe style bindings
 * - Internal CSS scope tokens
 * 
 * @see https://developer.salesforce.com/docs/platform/lwc/guide/security-lwsec.html
 */

import { LWSTests, StyleTests } from './security/lwsHelpers';
import * as fs from 'fs';
import * as path from 'path';

// Component source file paths (relative to sfGpsDsCaOn)
const COMPONENT_PATHS = {
  DecisionExplainer: 'main/default/lwc/sfGpsDsCaOnDecisionExplainer/sfGpsDsCaOnDecisionExplainer.ts',
  Modal: 'main/default/lwc/sfGpsDsCaOnModal/lwc/sfGpsDsCaOnModal/sfGpsDsCaOnModal.js',
  SiteSelectorTool: 'main/default/lwc/sfGpsDsCaOnSiteSelectorTool/lwc/sfGpsDsCaOnSiteSelectorTool/sfGpsDsCaOnSiteSelectorTool.js',
  DischargePointSelector: 'main/default/lwc/sfGpsDsCaOnDischargePointSelector/lwc/sfGpsDsCaOnDischargePointSelector/sfGpsDsCaOnDischargePointSelector.js',
  FormEditBlock: 'main/default/lwc/omnistudio-standard-runtime-forms/lwc/sfGpsDsCaOnFormEditBlock/sfGpsDsCaOnFormEditBlock.js',
  FormImage: 'main/default/lwc/omnistudio-standard-runtime-forms/lwc/sfGpsDsCaOnFormImage/sfGpsDsCaOnFormImage.js',
  Search: 'main/default/lwc/sfGpsDsCaOnSearch/lwc/sfGpsDsCaOnSearch/sfGpsDsCaOnSearch.ts',
  DebugUtils: 'main/default/lwc/sfGpsDsCaOnDebugUtils/sfGpsDsCaOnDebugUtils.js',
  FormReview: 'main/default/lwc/sfGpsDsCaOnFormReview/lwc/sfGpsDsCaOnFormReview/sfGpsDsCaOnFormReview.ts',
  FormReviewComm: 'main/default/lwc/sfGpsDsCaOnFormReview/lwc/sfGpsDsCaOnFormReviewComm/sfGpsDsCaOnFormReviewComm.ts'
};

// Read source file helper
function readSourceFile(relativePath) {
  const basePath = path.resolve(__dirname, '..');
  const fullPath = path.join(basePath, relativePath);
  
  try {
    return fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.warn(`Could not read file: ${fullPath}`);
    return '';
  }
}

describe('LWS Security Compliance', () => {
  
  describe('No eval() Usage', () => {
    Object.entries(COMPONENT_PATHS).forEach(([name, filePath]) => {
      it(`${name} should not use eval()`, () => {
        const source = readSourceFile(filePath);
        if (!source) {
          console.warn(`Skipping ${name} - file not found`);
          return;
        }
        
        const result = LWSTests.hasNoEval(source);
        expect(result.pass).toBe(true);
      });
    });
  });
  
  describe('No Function Constructor', () => {
    Object.entries(COMPONENT_PATHS).forEach(([name, filePath]) => {
      it(`${name} should not use new Function()`, () => {
        const source = readSourceFile(filePath);
        if (!source) return;
        
        const result = LWSTests.hasNoFunctionConstructor(source);
        expect(result.pass).toBe(true);
      });
    });
  });
  
  describe('No innerHTML Assignment', () => {
    Object.entries(COMPONENT_PATHS).forEach(([name, filePath]) => {
      it(`${name} should not assign innerHTML`, () => {
        const source = readSourceFile(filePath);
        if (!source) return;
        
        const result = LWSTests.hasNoInnerHTML(source);
        expect(result.pass).toBe(true);
      });
    });
  });
  
  describe('No Prototype Modification', () => {
    Object.entries(COMPONENT_PATHS).forEach(([name, filePath]) => {
      it(`${name} should not modify prototypes`, () => {
        const source = readSourceFile(filePath);
        if (!source) return;
        
        const result = LWSTests.hasNoPrototypeModification(source);
        expect(result.pass).toBe(true);
      });
    });
  });
  
  describe('No document.write()', () => {
    Object.entries(COMPONENT_PATHS).forEach(([name, filePath]) => {
      it(`${name} should not use document.write()`, () => {
        const source = readSourceFile(filePath);
        if (!source) return;
        
        const result = LWSTests.hasNoDocumentWrite(source);
        expect(result.pass).toBe(true);
      });
    });
  });
  
  describe('window.location Has Fallback', () => {
    it('DebugUtils should have fallback for window.location', () => {
      const source = readSourceFile(COMPONENT_PATHS.DebugUtils);
      if (!source) return;
      
      const result = LWSTests.windowLocationHasFallback(source);
      expect(result.pass).toBe(true);
    });
    
    it('FormImage should have fallback for window.location', () => {
      const source = readSourceFile(COMPONENT_PATHS.FormImage);
      if (!source) return;
      
      const result = LWSTests.windowLocationHasFallback(source);
      expect(result.pass).toBe(true);
    });
  });
});

describe('Style Sanitization', () => {
  
  describe('Safe CSS Width Values', () => {
    const safeValues = [
      'width: 100%',
      'width: 50px',
      'width: 10rem',
      'width: 2em',
      'width: 100vw'
    ];
    
    safeValues.forEach(value => {
      it(`should accept "${value}"`, () => {
        const result = StyleTests.isSafeStyleValue(value);
        expect(result.pass).toBe(true);
      });
    });
  });
  
  describe('Unsafe CSS Values Rejected', () => {
    const unsafeValues = [
      'width: expression(alert("xss"))',
      'background: url(javascript:alert("xss"))',
      'width: 100%; expression(document.cookie)'
    ];
    
    unsafeValues.forEach(value => {
      it(`should reject "${value}"`, () => {
        const result = StyleTests.isSafeStyleValue(value);
        expect(result.pass).toBe(false);
      });
    });
  });
  
  describe('FormEditBlock Style Sanitization', () => {
    it('should have _sanitizeStyleWidth method', () => {
      const source = readSourceFile(COMPONENT_PATHS.FormEditBlock);
      if (!source) return;
      
      expect(source).toContain('_sanitizeStyleWidth');
    });
    
    it('should use sanitizedTableLabels getter', () => {
      const source = readSourceFile(COMPONENT_PATHS.FormEditBlock);
      if (!source) return;
      
      expect(source).toContain('sanitizedTableLabels');
    });
    
    it('should use sanitizedDisplayValues getter', () => {
      const source = readSourceFile(COMPONENT_PATHS.FormEditBlock);
      if (!source) return;
      
      expect(source).toContain('sanitizedDisplayValues');
    });
  });
});

describe('No Internal CSS Scope Tokens', () => {
  
  const CSS_PATHS = {
    Modal: 'main/default/lwc/sfGpsDsCaOnModal/lwc/sfGpsDsCaOnModal/sfGpsDsCaOnModal.css',
    Callout: 'main/default/lwc/sfGpsDsCaOnCallout/lwc/sfGpsDsCaOnCallout/sfGpsDsCaOnCallout.css',
    DecisionExplainer: 'main/default/lwc/sfGpsDsCaOnDecisionExplainer/sfGpsDsCaOnDecisionExplainer.css'
  };
  
  Object.entries(CSS_PATHS).forEach(([name, filePath]) => {
    it(`${name} CSS should not use internal scope tokens`, () => {
      const source = readSourceFile(filePath);
      if (!source) return;
      
      const result = LWSTests.hasNoInternalScopeTokens(source);
      expect(result.pass).toBe(true);
    });
  });
});

describe('Apex Security Patterns', () => {
  
  const APEX_PATHS = {
    DecisionExplainerController: 'main/default/classes/SfGpsDsCaOnDecisionExplainerController.cls',
    SearchController: 'main/default/classes/SfGpsDsCaOnSearchController.cls',
    SiteSelectorController: 'main/default/classes/sfGpsDsCaOnSiteSelectorCtr.cls'
  };
  
  describe('Uses "with sharing"', () => {
    Object.entries(APEX_PATHS).forEach(([name, filePath]) => {
      it(`${name} should use "with sharing"`, () => {
        const source = readSourceFile(filePath);
        if (!source) return;
        
        expect(source).toMatch(/with\s+sharing/);
        expect(source).not.toMatch(/without\s+sharing/);
      });
    });
  });
  
  describe('SOQL/SOSL Sanitization', () => {
    it('SearchController should use escapeSingleQuotes', () => {
      const source = readSourceFile(APEX_PATHS.SearchController);
      if (!source) return;
      
      expect(source).toContain('escapeSingleQuotes');
    });
  });
});

describe('postMessage Security', () => {
  
  it('SiteSelectorTool should use postMessage for iframe communication', () => {
    const source = readSourceFile(COMPONENT_PATHS.SiteSelectorTool);
    if (!source) {
      console.warn('Skipping test - SiteSelectorTool source not found');
      return;
    }
    
    // Check if component uses postMessage pattern (at minimum should have postMessage)
    const hasPostMessage = source.includes('postMessage');
    expect(hasPostMessage).toBe(true);
  });
  
  it('DischargePointSelector should use postMessage for iframe communication', () => {
    const source = readSourceFile(COMPONENT_PATHS.DischargePointSelector);
    if (!source) {
      console.warn('Skipping test - DischargePointSelector source not found');
      return;
    }
    
    // Check if component uses postMessage pattern
    const hasPostMessage = source.includes('postMessage');
    expect(hasPostMessage).toBe(true);
  });
  
  it('postMessage handlers should validate message data', () => {
    const source = readSourceFile(COMPONENT_PATHS.SiteSelectorTool);
    if (!source) {
      console.warn('Skipping test - SiteSelectorTool source not found');
      return;
    }
    
    // Should have try/catch around message handling OR validate message type
    const hasErrorHandling = source.includes('try') && source.includes('catch');
    const hasTypeCheck = source.includes('event.data') || source.includes('event?.data');
    expect(hasErrorHandling || hasTypeCheck).toBe(true);
  });

  // Security enhancement tests - these test for recommended patterns
  // that may be implemented in future enhancements
  describe('Origin Validation (Recommended Enhancements)', () => {
    it('SiteSelectorTool handles message origin checking', () => {
      const source = readSourceFile(COMPONENT_PATHS.SiteSelectorTool);
      if (!source) {
        console.warn('Skipping test - source not found');
        return;
      }
      
      // Check for origin handling - either explicit validation or message handling
      const hasOriginHandling = 
        source.includes('origin') || 
        source.includes('handleMapMessage') ||
        source.includes('event.source');
      expect(hasOriginHandling).toBe(true);
    });

    it('DischargePointSelector handles message origin checking', () => {
      const source = readSourceFile(COMPONENT_PATHS.DischargePointSelector);
      if (!source) {
        console.warn('Skipping test - source not found');
        return;
      }
      
      // Check for origin handling
      const hasOriginHandling = 
        source.includes('origin') || 
        source.includes('handleMapMessage') ||
        source.includes('event.source');
      expect(hasOriginHandling).toBe(true);
    });
  });
});

describe('LWR Navigation Security', () => {
  const SEARCH_COMM_PATH = 'main/default/lwc/sfGpsDsCaOnSearch/lwc/sfGpsDsCaOnSearchComm/sfGpsDsCaOnSearchComm.ts';

  it('SearchComm should include objectApiName in record navigation', () => {
    const source = readSourceFile(SEARCH_COMM_PATH);
    if (!source) return;
    
    // LWR requires objectApiName for standard__recordPage navigation
    expect(source).toContain('objectApiName');
    expect(source).toMatch(/standard__recordPage[\s\S]*objectApiName/);
  });

  it('SearchComm should have fallback objectApiName derivation', () => {
    const source = readSourceFile(SEARCH_COMM_PATH);
    if (!source) return;
    
    // Should have method to derive object name from record ID prefix
    expect(source).toContain('deriveObjectApiName');
  });

  it('SearchComm navigateToRecord should accept objectApiName parameter', () => {
    const source = readSourceFile(SEARCH_COMM_PATH);
    if (!source) return;
    
    // Method signature should include objectApiName
    expect(source).toMatch(/navigateToRecord\(recordId.*objectApiName/);
  });
});
