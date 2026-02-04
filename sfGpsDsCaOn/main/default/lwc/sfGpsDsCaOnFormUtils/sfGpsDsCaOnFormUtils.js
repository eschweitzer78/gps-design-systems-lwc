/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Shared utility functions for Ontario DS Form components.
 * Used by both Comm (Light DOM) and Omni (Shadow DOM) versions.
 *
 * This reduces code duplication across component variants by ~80%.
 */

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormUtils";

/* ========================================
 * JSON PARSING
 * ======================================== */

/**
 * Parse JSON input that may be escaped by OmniStudio.
 * Handles: arrays, objects, strings, and double-escaped JSON.
 * @param {string|Array|Object} input - The input to parse
 * @returns {Array} Parsed options array
 */
export function parseOptionsJson(input) {
  if (!input) {
    if (DEBUG) console.log(CLASS_NAME, "parseOptionsJson: input is empty");
    return [];
  }

  // Already an array - return directly
  if (Array.isArray(input)) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "parseOptionsJson: input is already an array",
        input.length
      );
    return input;
  }

  // Object (but not array) - wrap in array or return empty
  if (typeof input === "object") {
    if (DEBUG)
      console.log(CLASS_NAME, "parseOptionsJson: input is an object", input);
    return input.value !== undefined ? [input] : [];
  }

  // String - try to parse, handling OmniStudio double-escaping
  if (typeof input === "string") {
    let jsonStr = input;

    // OmniStudio sometimes double-escapes JSON strings
    if (
      jsonStr.includes("\\[") ||
      jsonStr.includes("\\{") ||
      jsonStr.includes('\\"')
    ) {
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "parseOptionsJson: detected escaped JSON, unescaping"
        );
      jsonStr = jsonStr
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]")
        .replace(/\\\{/g, "{")
        .replace(/\\\}/g, "}")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }

    try {
      const parsed = JSON.parse(jsonStr);
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "parseOptionsJson: parsed string",
          Array.isArray(parsed) ? parsed.length : "not array"
        );
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      if (DEBUG)
        console.error(
          CLASS_NAME,
          "parseOptionsJson: JSON.parse failed",
          e.message
        );
      return [];
    }
  }

  if (DEBUG)
    console.log(
      CLASS_NAME,
      "parseOptionsJson: unknown input type",
      typeof input
    );
  return [];
}

/* ========================================
 * ID GENERATION
 * ======================================== */

/**
 * Generate unique IDs for accessibility attributes.
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}

/* ========================================
 * CSS CLASS COMPUTATION
 * ======================================== */

/**
 * Compute CSS class for dropdown/select element.
 * @param {boolean} isInvalid - Whether the field is invalid
 * @param {string} errorMessage - Error message (if any)
 * @param {string} className - Additional class names
 * @returns {string} Computed CSS class string
 */
export function computeSelectClassName(isInvalid, errorMessage, className) {
  let classes = "ontario-input ontario-dropdown";
  if (isInvalid || errorMessage) {
    classes += " ontario-input__error";
  }
  if (className) {
    classes += ` ${className}`;
  }
  return classes;
}

/**
 * Compute CSS class for text input element.
 * @param {boolean} isInvalid - Whether the field is invalid
 * @param {string} errorMessage - Error message (if any)
 * @param {string} className - Additional class names
 * @returns {string} Computed CSS class string
 */
export function computeInputClassName(isInvalid, errorMessage, className) {
  let classes = "ontario-input";
  if (isInvalid || errorMessage) {
    classes += " ontario-input__error";
  }
  if (className) {
    classes += ` ${className}`;
  }
  return classes;
}

/**
 * Compute CSS class for textarea element.
 * @param {boolean} isInvalid - Whether the field is invalid
 * @param {string} errorMessage - Error message (if any)
 * @param {string} className - Additional class names
 * @returns {string} Computed CSS class string
 */
export function computeTextareaClassName(isInvalid, errorMessage, className) {
  let classes = "ontario-textarea";
  if (isInvalid || errorMessage) {
    classes += " ontario-textarea__error";
  }
  if (className) {
    classes += ` ${className}`;
  }
  return classes;
}

/* ========================================
 * ACCESSIBILITY
 * ======================================== */

/**
 * Compute aria-describedby attribute.
 * @param {string} hintText - Hint text
 * @param {string} errorMessage - Error message
 * @param {string} hintId - Hint element ID
 * @param {string} errorId - Error element ID
 * @returns {string|null} Aria-describedby value or null
 */
export function computeAriaDescribedBy(
  hintText,
  errorMessage,
  hintId,
  errorId
) {
  const ids = [];
  if (hintText) ids.push(hintId);
  if (errorMessage) ids.push(errorId);
  return ids.length > 0 ? ids.join(" ") : null;
}

/**
 * Get flag text for required/optional labels.
 * @param {boolean} required - Is field required
 * @param {boolean} optional - Is field optional
 * @param {Object} labels - Labels object with Common.Required and Common.Optional
 * @returns {string} Flag text
 */
export function getFlagText(required, optional, labels = null) {
  if (required) return labels?.Common?.Required || "required";
  if (optional) return labels?.Common?.Optional || "optional";
  return "";
}

/* ========================================
 * OPTIONS HANDLING
 * ======================================== */

/**
 * Decorate options with selected state for dropdowns/radios.
 * @param {Array} options - Options array
 * @param {string} selectedValue - Currently selected value
 * @returns {Array} Options with selected boolean
 */
export function decorateOptions(options, selectedValue) {
  return options.map((opt) => ({
    ...opt,
    selected: opt.value === selectedValue
  }));
}

/**
 * Decorate options with checked state for checkboxes.
 * @param {Array} options - Options array
 * @param {Array} selectedValues - Array of selected values
 * @returns {Array} Options with checked boolean
 */
export function decorateCheckboxOptions(options, selectedValues = []) {
  const valuesSet = new Set(selectedValues);
  return options.map((opt) => ({
    ...opt,
    checked: valuesSet.has(opt.value)
  }));
}

/**
 * Filter cascading options by parent value.
 * @param {Array} options - Options array with parentValue property
 * @param {string} parentValue - Parent value to filter by
 * @returns {Array} Filtered options
 */
export function filterByParentValue(options, parentValue) {
  if (!parentValue) return [];
  return options.filter((opt) => opt.parentValue === parentValue);
}

/* ========================================
 * EVENT CREATION
 * ======================================== */

/**
 * Create OmniScript update event.
 * @param {string} fieldName - Field name for OmniScript data
 * @param {*} value - Value to update
 * @returns {CustomEvent|null} OmniScript update event or null if no fieldName
 */
export function createOmniUpdateEvent(fieldName, value) {
  if (!fieldName) return null;

  return new CustomEvent("omniupdatedata", {
    detail: { [fieldName]: value },
    bubbles: true,
    composed: true
  });
}

/**
 * Create change event with value detail.
 * @param {*} value - Value to include in event
 * @returns {CustomEvent} Change event
 */
export function createChangeEvent(value) {
  return new CustomEvent("change", {
    detail: { value },
    bubbles: true,
    composed: true
  });
}

/**
 * Create blur event with value detail.
 * @param {*} value - Value to include in event
 * @returns {CustomEvent} Blur event
 */
export function createBlurEvent(value) {
  return new CustomEvent("blur", {
    detail: { value },
    bubbles: true,
    composed: true
  });
}

/**
 * Create focus event with value detail.
 * @param {*} value - Value to include in event
 * @returns {CustomEvent} Focus event
 */
export function createFocusEvent(value) {
  return new CustomEvent("focus", {
    detail: { value },
    bubbles: true,
    composed: true
  });
}

/* ========================================
 * DATE UTILITIES
 * ======================================== */

/**
 * Parse ISO date string to parts.
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @returns {Object} Object with year, month, day
 */
export function parseDateParts(isoDate) {
  if (!isoDate) return { year: "", month: "", day: "" };

  const parts = isoDate.split("-");
  return {
    year: parts[0] || "",
    month: parts[1] || "",
    day: parts[2] || ""
  };
}

/**
 * Format date parts to ISO string.
 * @param {string} year - Year (4 digits)
 * @param {string} month - Month (1-12)
 * @param {string} day - Day (1-31)
 * @returns {string} ISO date string or empty string if incomplete
 */
export function formatDateIso(year, month, day) {
  if (!year || !month || !day) return "";

  const y = year.padStart(4, "0");
  const m = month.padStart(2, "0");
  const d = day.padStart(2, "0");

  return `${y}-${m}-${d}`;
}

/**
 * Validate date parts.
 * @param {string} year - Year
 * @param {string} month - Month
 * @param {string} day - Day
 * @returns {boolean} True if valid date
 */
export function isValidDate(year, month, day) {
  if (!year || !month || !day) return false;

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  // Check if date is valid (handles month lengths and leap years)
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

// Default export with all utilities
export default {
  parseOptionsJson,
  generateId,
  computeSelectClassName,
  computeInputClassName,
  computeTextareaClassName,
  computeAriaDescribedBy,
  getFlagText,
  decorateOptions,
  decorateCheckboxOptions,
  filterByParentValue,
  createOmniUpdateEvent,
  createChangeEvent,
  createBlurEvent,
  createFocusEvent,
  parseDateParts,
  formatDateIso,
  isValidDate
};
