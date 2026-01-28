/**
 * Jest Configuration for sfGpsDsCaOn Tests
 * 
 * Extends the base jest config with sfGpsDsCaOn-specific settings.
 */

const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
  ...jestConfig,
  
  // Display name for this test suite
  displayName: 'sfGpsDsCaOn',
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Root directory
  rootDir: '../..',
  
  // Test file patterns
  testMatch: [
    '**/sfGpsDsCaOn/__tests__/**/*.test.js',
    '**/sfGpsDsCaOn/**/__tests__/**/*.test.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/sfGpsDsCaOn/__tests__/jest.setup.js',
    '<rootDir>/jest-matchers-setup.js'
  ],
  
  // Module name mapper for LWC components
  moduleNameMapper: {
    // Ontario DS components
    '^c/sfGpsDsCaOn(.*)$': '<rootDir>/sfGpsDsCaOn/main/default/lwc/sfGpsDsCaOn$1/sfGpsDsCaOn$1',
    
    // Base components
    '^c/sfGpsDs(.*)$': '<rootDir>/sfGpsDs/main/default/lwc/sfGpsDs$1/sfGpsDs$1',
    
    // OmniScript form components
    '^c/sfGpsDsCaOnForm(.*)$': 
      '<rootDir>/sfGpsDsCaOn/main/default/lwc/omnistudio-standard-runtime-forms/lwc/sfGpsDsCaOnForm$1/sfGpsDsCaOnForm$1',
    
    // CSS mocks
    '\\.css$': '<rootDir>/__test__/jest-mocks/css.js',
    
    // Ontario DS external components
    '@ongov/ontario-design-system-component-library': '<rootDir>/__test__/jest-mocks/ontario-ds.js'
  },
  
  // Transform settings
  transform: {
    '^.+\\.js$': require.resolve('@lwc/jest-transformer')
  },
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'sfGpsDsCaOn/main/default/lwc/**/*.js',
    '!sfGpsDsCaOn/main/default/lwc/**/*.test.js',
    '!sfGpsDsCaOn/main/default/lwc/**/jest.*.js',
    '!**/node_modules/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  
  // Coverage report output
  coverageDirectory: '<rootDir>/sfGpsDsCaOn/__tests__/coverage',
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true
};
