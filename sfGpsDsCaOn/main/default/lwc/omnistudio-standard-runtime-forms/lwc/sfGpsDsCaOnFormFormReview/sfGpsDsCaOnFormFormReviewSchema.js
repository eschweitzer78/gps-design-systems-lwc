/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @fileoverview Schema validation and version detection for FormReview component
 * Detects OmniStudio version signatures and validates data structures
 */

/**
 * Known OmniStudio version signatures based on property presence
 * Used to detect API changes and apply version-specific logic
 */
export const VERSION_SIGNATURES = {
  "omnistudio-pre-2024": {
    description: "OmniStudio before 2024 updates",
    signatures: {
      hasLabel: true,
      hasCaption: false,
      hasDisplayName: false,
      hasPropSetMapNested: true
    }
  },
  "omnistudio-2024-winter": {
    description: "OmniStudio Winter 2024",
    signatures: {
      hasLabel: true,
      hasCaption: true,
      hasDisplayName: false,
      hasPropSetMapNested: true
    }
  },
  "omnistudio-2025-spring": {
    description: "OmniStudio Spring 2025",
    signatures: {
      hasLabel: true,
      hasCaption: true,
      hasDisplayName: true,
      hasPropSetMapNested: true
    }
  },
  "omnistudio-2026": {
    description: "OmniStudio 2026+",
    signatures: {
      hasLabel: true,
      hasCaption: true,
      hasDisplayName: true,
      hasPropSetMapNested: true,
      hasVlcPrefix: true
    }
  }
};

/**
 * Expected property paths for label resolution
 * Ordered by preference (first match wins)
 */
export const LABEL_PROPERTY_PATHS = [
  "propSetMap.label",
  "propSetMap.caption",
  "propSetMap.text",
  "propSetMap.title",
  "propSetMap.displayName",
  "label",
  "name"
];

/**
 * Expected property paths for options resolution
 */
export const OPTIONS_PROPERTY_PATHS = [
  "propSetMap.options",
  "propSetMap.optionSource",
  "propSetMap.controllingField.options",
  "options"
];

/**
 * Expected property paths for visibility detection
 */
export const VISIBILITY_PROPERTY_PATHS = [
  "propSetMap.show",
  "bShow",
  "bHidden",
  "response.hidden",
  "propSetMap.conditionType"
];

/**
 * Expected property paths for file name resolution
 */
export const FILENAME_PROPERTY_PATHS = [
  "fileName",
  "FileName",
  "name",
  "Name",
  "Title",
  "title",
  "PathOnClient",
  "pathOnClient"
];

/**
 * Schema validation result
 */
export class SchemaValidationResult {
  constructor() {
    this.isValid = true;
    this.warnings = [];
    this.errors = [];
    this.detectedVersion = "unknown";
    this.propertyPathsFound = new Map();
    this.propertyPathsMissing = new Map();
    this.newPropertiesDetected = [];
  }

  addWarning(code, message, context = {}) {
    this.warnings.push({ code, message, context });
  }

  addError(code, message, context = {}) {
    this.isValid = false;
    this.errors.push({ code, message, context });
  }

  addPropertyFound(category, path) {
    if (!this.propertyPathsFound.has(category)) {
      this.propertyPathsFound.set(category, []);
    }
    this.propertyPathsFound.get(category).push(path);
  }

  addPropertyMissing(category, path) {
    if (!this.propertyPathsMissing.has(category)) {
      this.propertyPathsMissing.set(category, []);
    }
    this.propertyPathsMissing.get(category).push(path);
  }
}

/**
 * FormReviewSchemaValidator - Validates OmniScript data structures
 */
export class FormReviewSchemaValidator {
  /**
   * Validate omniJsonData structure
   * @param {Object} omniJsonData - The data object
   * @returns {SchemaValidationResult}
   */
  validateOmniJsonData(omniJsonData) {
    const result = new SchemaValidationResult();

    if (!omniJsonData) {
      result.addError("NO_DATA", "omniJsonData is null or undefined");
      return result;
    }

    if (typeof omniJsonData !== "object") {
      result.addError(
        "INVALID_TYPE",
        `omniJsonData is ${typeof omniJsonData}, expected object`
      );
      return result;
    }

    const keys = Object.keys(omniJsonData);
    if (keys.length === 0) {
      result.addWarning("EMPTY_DATA", "omniJsonData has no properties");
      return result;
    }

    // Check for expected step structure
    let stepsFound = 0;
    let primitiveValues = 0;

    for (const key of keys) {
      const value = omniJsonData[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        stepsFound++;
      } else if (typeof value !== "object") {
        primitiveValues++;
      }
    }

    if (stepsFound === 0) {
      result.addWarning(
        "NO_STEPS",
        "No step-like structures found in omniJsonData"
      );
    }

    if (primitiveValues > stepsFound) {
      result.addWarning(
        "UNUSUAL_STRUCTURE",
        "More primitive values than step objects detected",
        {
          stepsFound,
          primitiveValues
        }
      );
    }

    return result;
  }

  /**
   * Validate omniScriptHeaderDef structure
   * @param {Object} headerDef - The header definition object
   * @returns {SchemaValidationResult}
   */
  validateHeaderDef(headerDef) {
    const result = new SchemaValidationResult();

    if (!headerDef) {
      result.addWarning(
        "NO_HEADER_DEF",
        "omniScriptHeaderDef is null or undefined - using fallback mode"
      );
      return result;
    }

    // Check for children array
    if (!headerDef.children) {
      result.addWarning(
        "NO_CHILDREN",
        "omniScriptHeaderDef.children is missing"
      );
    } else if (!Array.isArray(headerDef.children)) {
      result.addError(
        "CHILDREN_NOT_ARRAY",
        "omniScriptHeaderDef.children is not an array"
      );
    } else {
      // Validate first child to detect version signature
      if (headerDef.children.length > 0) {
        const firstChild = headerDef.children[0];
        this._detectVersionFromElement(firstChild, result);
        this._validateElementStructure(firstChild, result);
      }
    }

    return result;
  }

  /**
   * Detect OmniStudio version from element structure
   * @param {Object} element - An element definition
   * @param {SchemaValidationResult} result - Result to update
   * @private
   */
  _detectVersionFromElement(element, result) {
    if (!element) return;

    const propSetMap = element.propSetMap || {};

    const signature = {
      hasLabel: "label" in propSetMap,
      hasCaption: "caption" in propSetMap,
      hasDisplayName: "displayName" in propSetMap,
      hasPropSetMapNested: element.eleArray?.[0]?.propSetMap !== undefined,
      hasVlcPrefix: element.name?.startsWith("vlc") || false
    };

    // Match against known signatures
    let bestMatch = "unknown";
    let bestMatchScore = 0;

    for (const [version, config] of Object.entries(VERSION_SIGNATURES)) {
      let score = 0;
      const versionSig = config.signatures;

      for (const [key, expected] of Object.entries(versionSig)) {
        if (signature[key] === expected) {
          score++;
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = version;
      }
    }

    result.detectedVersion = bestMatch;

    // Check for new unknown properties that might indicate API changes
    const knownProps = [
      "label",
      "caption",
      "text",
      "title",
      "displayName",
      "show",
      "options"
    ];
    for (const key of Object.keys(propSetMap)) {
      if (
        !knownProps.includes(key) &&
        !key.startsWith("_") &&
        !key.startsWith("vlc")
      ) {
        result.newPropertiesDetected.push(key);
      }
    }

    if (result.newPropertiesDetected.length > 0) {
      result.addWarning(
        "NEW_PROPERTIES_DETECTED",
        `Unknown properties detected: ${result.newPropertiesDetected.slice(0, 5).join(", ")}`,
        { properties: result.newPropertiesDetected }
      );
    }
  }

  /**
   * Validate element structure and property paths
   * @param {Object} element - An element definition
   * @param {SchemaValidationResult} result - Result to update
   * @private
   */
  _validateElementStructure(element, result) {
    if (!element) return;

    const propSetMap = element.propSetMap || {};

    // Check label paths
    let labelFound = false;
    for (const path of LABEL_PROPERTY_PATHS) {
      const value = this._resolvePath(element, path);
      if (value !== undefined) {
        result.addPropertyFound("label", path);
        labelFound = true;
        break;
      } else {
        result.addPropertyMissing("label", path);
      }
    }

    if (!labelFound && element.name) {
      result.addWarning(
        "NO_LABEL_PATH",
        `No label property found for element, will use name: "${element.name}"`,
        { elementName: element.name }
      );
    }

    // Check for deprecated patterns
    if (propSetMap.label === undefined && propSetMap.caption !== undefined) {
      result.addWarning(
        "DEPRECATED_PATH",
        "propSetMap.label not found, using caption fallback",
        { elementName: element.name }
      );
    }
  }

  /**
   * Resolve a dot-notation path on an object
   * @param {Object} obj - Object to resolve path on
   * @param {string} path - Dot-notation path
   * @returns {*} Resolved value or undefined
   * @private
   */
  _resolvePath(obj, path) {
    const parts = path.split(".");
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  }

  /**
   * Get property with fallback chain and logging
   * @param {Object} obj - Object to get property from
   * @param {Array<string>} paths - Array of paths to try in order
   * @param {Function} logCallback - Callback to log fallback usage
   * @returns {{ value: *, usedPath: string, triedPaths: Array<string> }}
   */
  getPropertyWithFallback(obj, paths, logCallback = null) {
    const triedPaths = [];

    for (const path of paths) {
      triedPaths.push(path);
      const value = this._resolvePath(obj, path);
      if (value !== undefined && value !== null) {
        // Log if not the first (primary) path
        if (triedPaths.length > 1 && logCallback) {
          logCallback(paths[0], path, triedPaths);
        }
        return { value, usedPath: path, triedPaths };
      }
    }

    return { value: undefined, usedPath: null, triedPaths };
  }
}

// Default validator instance
export const formReviewSchemaValidator = new FormReviewSchemaValidator();
