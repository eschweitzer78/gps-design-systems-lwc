"use strict";

const { defineConfig, globalIgnores } = require("eslint/config");
const eslintJs = require("@eslint/js");
const jestPlugin = require("eslint-plugin-jest");
const salesforceLwcConfig = require("@salesforce/eslint-config-lwc/recommended");
const globals = require("globals");

module.exports = defineConfig([
  // LWC configuration for force-app/main/default/lwc
  {
    files: ["**/lwc/**/*.js"],
    extends: [salesforceLwcConfig]
  },

  // LWC configuration with override for LWC test files
  {
    files: ["**/lwc/**/*.test.js"],
    extends: [salesforceLwcConfig],
    rules: {
      "@lwc/lwc/no-unexpected-wire-adapter-usages": "off"
    },
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  // Jest mocks configuration
  {
    files: ["force-app/test/jest-mocks/**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...jestPlugin.environments.globals.globals
      }
    },
    plugins: {
      eslintJs
    },
    extends: ["eslintJs/recommended"]
  },

  globalIgnores([
    ".config/*",
    "**/lwc/**/*.css",
    "**/lwc/**/*.html",
    "**/lwc/**/*.json",
    "**/lwc/**/*.svg",
    "**/lwc/**/*.xml",
    "**/lwc/**/*.map",
    "**/lwc/**/*.scss",
    "**/aura/**/*.auradoc",
    "**/aura/**/*.cmp",
    "**/aura/**/*.css",
    "**/aura/**/*.design",
    "**/aura/**/*.evt",
    "**/aura/**/*.json",
    "**/aura/**/*.svg",
    "**/aura/**/*.tokens",
    "**/aura/**/*.xml",
    "**/aura/**/*.app",
    "**/aura/**/*.map",
    "**/aura/**/*.scss",
    "sfGpsDsAuNswFull",
    "sfGpsDsAuQldFull",
    "sfGpsDsAuVic",
    "sfGpsDsAuVicFull",
    "sfGpsDsAuVic2Full",
    "sfGpsDsFrGovFull",
    "sfGpsDsSgGovFull",
    "sfGpsDsUkGovFull",
    "sfGpsTemp",
    ".sfdx",
    ".sf"
  ])
]);
