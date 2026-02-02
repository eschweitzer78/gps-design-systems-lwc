import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for sfGpsDsCaOn E2E Tests
 * 
 * Tests run against an LWR Experience Cloud site with guest access enabled.
 * Set BASE_URL environment variable to your showcase site URL.
 */

export default defineConfig({
  testDir: './tests',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    process.env.CI ? ['github'] : ['list']
  ].filter(Boolean),
  
  // Shared settings for all projects
  use: {
    // Base URL for the showcase site
    // Trailing slash is required for relative paths to work correctly
    baseURL: process.env.BASE_URL || 'https://dfn00000c2gpmeaf.my.site.com/sfGpsDsCaOn/',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'on-first-retry',
    
    // Default timeout for actions
    actionTimeout: 10000,
    
    // Default navigation timeout
    navigationTimeout: 30000
  },

  // Configure projects for multiple browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],

  // Global timeout
  timeout: 60000,
  
  // Expect timeout
  expect: {
    timeout: 10000
  },

  // Output folder for test artifacts
  outputDir: 'test-results'
});
