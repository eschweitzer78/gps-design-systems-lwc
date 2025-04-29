// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([
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
  "sfGpsTemp",
  ".sfdx",
  ".sf"
])]);