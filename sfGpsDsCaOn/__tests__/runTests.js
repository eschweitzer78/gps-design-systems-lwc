#!/usr/bin/env node

/**
 * Test Runner for sfGpsDsCaOn Components
 * 
 * Runs unit tests, accessibility tests, and generates reports.
 * 
 * Usage:
 *   node runTests.js [options]
 * 
 * Options:
 *   --unit        Run unit tests only
 *   --a11y        Run accessibility tests only
 *   --all         Run all tests (default)
 *   --coverage    Generate coverage report
 *   --watch       Watch mode
 *   --verbose     Verbose output
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
const options = {
  unit: args.includes('--unit'),
  a11y: args.includes('--a11y'),
  all: args.includes('--all') || (!args.includes('--unit') && !args.includes('--a11y')),
  coverage: args.includes('--coverage'),
  watch: args.includes('--watch'),
  verbose: args.includes('--verbose')
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('');
  log(`${'='.repeat(60)}`, colors.cyan);
  log(` ${title}`, colors.bright);
  log(`${'='.repeat(60)}`, colors.cyan);
  console.log('');
}

function runCommand(command, description) {
  log(`> ${description}`, colors.yellow);
  log(`  $ ${command}`, colors.reset);
  console.log('');
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../..')
    });
    log(`✓ ${description} completed`, colors.green);
    return true;
  } catch (error) {
    log(`✗ ${description} failed`, colors.red);
    return false;
  }
}

async function main() {
  logSection('sfGpsDsCaOn Test Suite');
  
  const results = {
    unit: null,
    a11y: null,
    coverage: null
  };
  
  // Run unit tests
  if (options.all || options.unit) {
    logSection('Unit Tests');
    
    let cmd = 'npx sfdx-lwc-jest --skipApiVersionCheck';
    cmd += ' --testPathPattern="sfGpsDsCaOn/__tests__"';
    
    if (options.verbose) cmd += ' --verbose';
    if (options.watch) cmd += ' --watch';
    if (options.coverage) cmd += ' --coverage --collectCoverageFrom="sfGpsDsCaOn/**/*.js"';
    
    results.unit = runCommand(cmd, 'Running unit tests');
  }
  
  // Run accessibility tests
  if (options.all || options.a11y) {
    logSection('Accessibility Tests');
    
    let cmd = 'npx sfdx-lwc-jest --skipApiVersionCheck';
    cmd += ' --testPathPattern="sfGpsDsCaOn/__tests__/accessibility"';
    
    if (options.verbose) cmd += ' --verbose';
    
    results.a11y = runCommand(cmd, 'Running accessibility tests');
  }
  
  // Generate summary
  logSection('Test Summary');
  
  if (results.unit !== null) {
    const status = results.unit ? `${colors.green}PASS` : `${colors.red}FAIL`;
    log(`  Unit Tests:          ${status}${colors.reset}`);
  }
  
  if (results.a11y !== null) {
    const status = results.a11y ? `${colors.green}PASS` : `${colors.red}FAIL`;
    log(`  Accessibility Tests: ${status}${colors.reset}`);
  }
  
  console.log('');
  
  // Check for failures
  const allPassed = Object.values(results).every(r => r === null || r === true);
  
  if (allPassed) {
    log('All tests passed!', colors.green);
    process.exit(0);
  } else {
    log('Some tests failed. See above for details.', colors.red);
    process.exit(1);
  }
}

// Generate test report
function generateReport(results) {
  const reportPath = path.resolve(__dirname, 'test-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    results,
    environment: {
      node: process.version,
      platform: process.platform
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report saved to: ${reportPath}`, colors.cyan);
}

main().catch(error => {
  log(`Error: ${error.message}`, colors.red);
  process.exit(1);
});
