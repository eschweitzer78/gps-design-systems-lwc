/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormFormReviewOmni";

/**
 * Maximum recursion depth for nested object extraction
 */
const MAX_RECURSION_DEPTH = 5;

/**
 * Security blocklist - fields that should never be displayed
 */
const SECURITY_BLOCKLIST = new Set([
  "ContextId",
  "runMode",
  "seed",
  "OmniProcessId",
  "OmniScriptId",
  "OmniScriptInstanceId",
  "OmniScriptVersionId",
  "Id",
  "RecordTypeId",
  "OwnerId",
  "CreatedById",
  "LastModifiedById",
  "apiKey",
  "apiSecret",
  "accessToken",
  "refreshToken",
  "authToken",
  "sessionId",
  "bearerToken",
  "HTTP_Response",
  "HTTP_Status",
  "HTTP_Headers",
  "httpResponse",
  "rawResponse",
  "TimeStamp",
  "Timestamp",
  "timestamp",
  "createdDate",
  "lastModifiedDate",
  "errorMessage",
  "stackTrace",
  "debugInfo",
  "ContentVersionId",
  "ContentDocumentId",
  "DocumentId"
]);

/**
 * Security blocklist prefixes
 */
const SECURITY_BLOCKLIST_PREFIXES = [
  "vlc",
  "_",
  "omni",
  "OS",
  "DRId",
  "SId",
  "sys",
  "internal",
  "debug",
  "temp",
  "tmp",
  "http",
  "api"
];

/**
 * Form Review component for OmniStudio Custom LWC.
 * Uses OmniscriptBaseMixin for OmniScript data access.
 * Renders summary list inline (no Light DOM child dependencies).
 *
 * OmniScript Configuration:
 * - Type: Custom Lightning Web Component
 * - lwcName: sfGpsDsCaOnFormFormReviewOmni
 * - customAttributes: heading, subheading, submitLabel, cancelLabel, etc.
 */
export default class SfGpsDsCaOnFormFormReviewOmni extends OmniscriptBaseMixin(
  LightningElement
) {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api heading = "Review your answers";
  @api subheading = "Please check your answers before submitting.";
  @api submitLabel = "Submit";
  @api cancelLabel = "Save for later";
  @api showSubmitWarning; // String from customAttributes: "true" or "false"
  @api submitWarningMessage =
    "You cannot change your answers after submitting.";
  @api autoGenerate; // String from customAttributes: "true" or "false", defaults to true behavior
  @api excludeSteps = "";
  @api excludeFields = "";
  @api labelSchema = "";
  @api fieldMapping = "";

  /* ========================================
   * PRIVATE STATE
   * ======================================== */

  @track _generatedSections = [];
  @track _statusMessage = "";
  _initialized = false;
  _lastDataHash = "";
  _excludeStepsSet = new Set();
  _excludeFieldsSet = new Set();
  _labelSchemaObj = {};
  _fieldMappingObj = {};

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");

    // Parse configuration
    this._parseConfiguration();

    // Generate sections
    this._generateSections();
    this._initialized = true;
  }

  renderedCallback() {
    if (this._initialized && this._parseAutoGenerate()) {
      this._generateSections();
    }
  }

  /* ========================================
   * CONFIGURATION PARSING
   * ======================================== */

  _parseConfiguration() {
    // Parse excludeSteps
    if (this.excludeSteps && typeof this.excludeSteps === "string") {
      this._excludeStepsSet = new Set(
        this.excludeSteps
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }

    // Parse excludeFields
    if (this.excludeFields && typeof this.excludeFields === "string") {
      this._excludeFieldsSet = new Set(
        this.excludeFields
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }

    // Parse labelSchema JSON
    if (this.labelSchema) {
      try {
        this._labelSchemaObj =
          typeof this.labelSchema === "string"
            ? JSON.parse(this._unescapeJson(this.labelSchema))
            : this.labelSchema;
      } catch (e) {
        if (DEBUG) console.error(CLASS_NAME, "labelSchema parse error", e);
        this._labelSchemaObj = {};
      }
    }

    // Parse fieldMapping JSON
    if (this.fieldMapping) {
      try {
        this._fieldMappingObj =
          typeof this.fieldMapping === "string"
            ? JSON.parse(this._unescapeJson(this.fieldMapping))
            : this.fieldMapping;
      } catch (e) {
        if (DEBUG) console.error(CLASS_NAME, "fieldMapping parse error", e);
        this._fieldMappingObj = {};
      }
    }
  }

  /**
   * Parse autoGenerate - defaults to true if not set
   * OmniScript customAttributes pass strings, not booleans
   */
  _parseAutoGenerate() {
    // Not set = default to true
    if (this.autoGenerate === undefined || this.autoGenerate === null) {
      return true;
    }
    // Boolean (shouldn't happen from customAttributes, but handle it)
    if (typeof this.autoGenerate === "boolean") {
      return this.autoGenerate;
    }
    // String from customAttributes - only "false" disables
    if (typeof this.autoGenerate === "string") {
      return this.autoGenerate.toLowerCase() !== "false";
    }
    return true;
  }

  /**
   * Parse showSubmitWarning - defaults to false if not set
   * OmniScript customAttributes pass strings, not booleans
   */
  _parseShowSubmitWarning() {
    // Not set = default to false
    if (
      this.showSubmitWarning === undefined ||
      this.showSubmitWarning === null
    ) {
      return false;
    }
    // Boolean
    if (typeof this.showSubmitWarning === "boolean") {
      return this.showSubmitWarning;
    }
    // String from customAttributes - only "true" enables
    if (typeof this.showSubmitWarning === "string") {
      return this.showSubmitWarning.toLowerCase() === "true";
    }
    return false;
  }

  /**
   * Unescape double-escaped JSON from OmniStudio customAttributes
   */
  _unescapeJson(input) {
    if (!input || typeof input !== "string") return input;

    if (input.includes("\\[") || input.includes('\\"')) {
      return input
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]")
        .replace(/\\\{/g, "{")
        .replace(/\\\}/g, "}")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }
    return input;
  }

  /* ========================================
   * SECTION GENERATION
   * ======================================== */

  _generateSections() {
    if (!this._parseAutoGenerate() || !this.omniJsonData) {
      this._generatedSections = [];
      return;
    }

    // Simple change detection
    const dataHash = this._computeHash(this.omniJsonData);
    if (dataHash === this._lastDataHash) return;
    this._lastDataHash = dataHash;

    const sections = [];

    try {
      for (const [stepName, stepData] of Object.entries(this.omniJsonData)) {
        // Skip excluded steps
        if (this._excludeStepsSet.has(stepName)) continue;

        // Skip internal fields
        if (this._isInternalField(stepName)) continue;

        // Skip non-objects
        if (!stepData || typeof stepData !== "object") continue;

        // Extract items from step
        const items = this._extractItems(stepName, stepData, 0);

        if (items.length > 0) {
          sections.push({
            id: `section-${stepName}`,
            heading: this._formatLabel(stepName),
            stepName: stepName,
            items: items
          });
        }
      }
    } catch (e) {
      if (DEBUG) console.error(CLASS_NAME, "Error generating sections", e);
    }

    this._generatedSections = sections;

    if (DEBUG) {
      console.log(CLASS_NAME, "Generated sections", this._generatedSections);
    }
  }

  _extractItems(stepName, stepData, depth) {
    if (depth >= MAX_RECURSION_DEPTH) return [];

    const items = [];

    for (const [fieldName, fieldValue] of Object.entries(stepData)) {
      const fieldPath = `${stepName}:${fieldName}`;

      // Security checks
      if (SECURITY_BLOCKLIST.has(fieldName)) continue;
      if (this._isBlocklistedPrefix(fieldName)) continue;
      if (this._excludeFieldsSet.has(fieldPath)) continue;
      if (this._excludeFieldsSet.has(fieldName)) continue;
      if (this._isInternalField(fieldName)) continue;

      // Skip null/undefined
      if (fieldValue === null || fieldValue === undefined) continue;

      // Handle arrays
      if (Array.isArray(fieldValue)) {
        const arrayValue = this._formatArrayValue(fieldValue, fieldPath);
        if (arrayValue) {
          items.push({
            id: `item-${fieldPath}`,
            key: this._getDisplayLabel(fieldPath, fieldName),
            value: arrayValue,
            fieldPath: fieldPath
          });
        }
        continue;
      }

      // Handle nested objects (flatten single-level)
      if (
        typeof fieldValue === "object" &&
        !this._isSpecialObject(fieldValue)
      ) {
        const nestedItems = this._extractItems(
          fieldPath,
          fieldValue,
          depth + 1
        );
        items.push(...nestedItems);
        continue;
      }

      // Format and add item
      const displayValue = this._formatValue(fieldValue, fieldPath);
      if (displayValue) {
        items.push({
          id: `item-${fieldPath}`,
          key: this._getDisplayLabel(fieldPath, fieldName),
          value: displayValue,
          fieldPath: fieldPath
        });
      }
    }

    return items;
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get sections() {
    return this._generatedSections;
  }

  get hasSections() {
    return this._generatedSections && this._generatedSections.length > 0;
  }

  get noSections() {
    return !this.hasSections;
  }

  get computedShowSubmitWarning() {
    return this._parseShowSubmitWarning();
  }

  /* ========================================
   * FORMATTING HELPERS
   * ======================================== */

  _getDisplayLabel(fieldPath, fieldName) {
    // Check fieldMapping first
    if (this._fieldMappingObj[fieldPath]) {
      return this._fieldMappingObj[fieldPath];
    }
    return this._formatLabel(fieldName);
  }

  _formatLabel(name) {
    if (!name) return "";

    // Remove common prefixes
    let label = name.replace(/^(txt|sel|cb|rad|num|date|time|cur)_?/i, "");

    // Insert spaces before capitals
    label = label.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Replace underscores
    label = label.replace(/_/g, " ");

    // Capitalize words
    return label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  _formatValue(value, fieldPath) {
    if (value === null || value === undefined) return "";

    // Boolean
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Object with label (selection)
    if (typeof value === "object" && value.label) {
      return value.label;
    }

    // File upload
    if (typeof value === "object" && value.name && value.size !== undefined) {
      const sizeKB = Math.round(value.size / 1024);
      return `${value.name} (${sizeKB} KB)`;
    }

    // String - check labelSchema
    if (typeof value === "string") {
      const schemaLabel = this._lookupLabel(fieldPath, value);
      if (schemaLabel) return schemaLabel;

      // Date formatting
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
          }
        } catch {
          // Return raw value
        }
      }

      return value;
    }

    // Number
    if (typeof value === "number") {
      return value.toLocaleString("en-CA");
    }

    return String(value);
  }

  _formatArrayValue(value, fieldPath) {
    return value
      .filter((v) => v !== null && v !== undefined)
      .map((v, idx) => this._formatValue(v, `${fieldPath}[${idx}]`))
      .filter(Boolean)
      .join(", ");
  }

  _lookupLabel(fieldPath, rawValue) {
    const fieldLabels = this._labelSchemaObj[fieldPath];
    if (fieldLabels && fieldLabels[rawValue]) {
      return fieldLabels[rawValue];
    }
    return null;
  }

  /* ========================================
   * VALIDATION HELPERS
   * ======================================== */

  _isInternalField(fieldName) {
    if (SECURITY_BLOCKLIST.has(fieldName)) return true;
    return this._isBlocklistedPrefix(fieldName);
  }

  _isBlocklistedPrefix(fieldName) {
    const lowerName = fieldName.toLowerCase();
    for (const prefix of SECURITY_BLOCKLIST_PREFIXES) {
      if (lowerName.startsWith(prefix.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  _isSpecialObject(obj) {
    if (obj.name && obj.size !== undefined) return true;
    if (obj.ContentVersionId || obj.ContentDocumentId) return true;
    if (obj.label !== undefined && obj.value !== undefined) return true;
    if (obj instanceof Date) return true;
    return false;
  }

  _computeHash(data) {
    if (!data) return "";
    try {
      const keys = Object.keys(data);
      if (keys.length === 0) return "empty";

      let fieldCount = 0;
      for (const key of keys) {
        const stepData = data[key];
        if (
          stepData &&
          typeof stepData === "object" &&
          !Array.isArray(stepData)
        ) {
          fieldCount += Object.keys(stepData).length;
        }
      }
      return `${keys.length}:${keys[0] || ""}:${fieldCount}`;
    } catch {
      return `fallback:${Date.now()}`;
    }
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleSubmit(event) {
    event.preventDefault();
    this._announceStatus("Submitting...");

    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(this, {}, "omnisave");
    } else {
      this.dispatchEvent(
        new CustomEvent("omnisave", { bubbles: true, composed: true })
      );
    }
  }

  handleCancel(event) {
    event.preventDefault();
    this._announceStatus("Saving for later...");

    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(this, { saveForLater: true }, "omnisave");
    } else {
      this.dispatchEvent(
        new CustomEvent("cancel", { bubbles: true, composed: true })
      );
    }
  }

  handleChangeClick(event) {
    const stepName = event.currentTarget.dataset.step;
    if (!stepName) return;

    event.preventDefault();
    this._navigateToStep(stepName);
  }

  /**
   * Navigate to a step by name.
   * Uses omniNavigateTo (preferred for Custom LWC) or falls back to dispatchOmniEventUtil.
   * @param {string} stepName - Step name to navigate to
   */
  _navigateToStep(stepName) {
    this._announceStatus(`Navigating to ${this._formatLabel(stepName)}...`);

    // Primary: Use omniNavigateTo (works best for Custom LWC)
    if (typeof this.omniNavigateTo === "function") {
      this.omniNavigateTo(stepName);
      return;
    }

    // Fallback: Try dispatchOmniEventUtil with step name
    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(
        this,
        { moveToStep: stepName },
        "omniautoadvance"
      );
      return;
    }

    // Last resort: Custom event
    this.dispatchEvent(
      new CustomEvent("omniautoadvance", {
        bubbles: true,
        composed: true,
        detail: { moveToStep: stepName }
      })
    );
  }

  _announceStatus(message) {
    this._statusMessage = "";
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._statusMessage = message;
    }, 100);
  }

  /* ========================================
   * VALIDATION API
   * ======================================== */

  @api
  checkValidity() {
    return true;
  }

  @api
  reportValidity() {
    return true;
  }

  @api
  setCustomValidity() {
    // No-op - display only component
  }
}
