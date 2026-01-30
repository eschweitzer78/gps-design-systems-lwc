/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";
import {
  FormReviewLogger,
  LOG_EVENTS
} from "./sfGpsDsCaOnFormFormReviewLogger";
import {
  FormReviewSchemaValidator,
  LABEL_PROPERTY_PATHS,
  FILENAME_PROPERTY_PATHS
} from "./sfGpsDsCaOnFormFormReviewSchema";

/**
 * Maximum recursion depth for nested object extraction
 * Prevents stack overflow and mobile performance issues
 */
const MAX_RECURSION_DEPTH = 5;

/**
 * Maximum recursion depth for indexing element definitions
 * Prevents performance issues on complex OmniScript definitions
 */
const MAX_INDEX_DEPTH = 10;

/**
 * Debounce delay for regeneration (ms)
 * Prevents excessive re-renders on rapid data changes
 */
const REGENERATE_DEBOUNCE_MS = 100;

/**
 * Security blocklist - O(1) lookup for sensitive field names
 * These fields are NEVER displayed to users
 */
const SECURITY_BLOCKLIST = new Set([
  // OmniScript internal IDs
  "ContextId",
  "runMode",
  "seed",
  "OmniProcessId",
  "OmniScriptId",
  "OmniScriptInstanceId",
  "OmniScriptVersionId",
  // Salesforce IDs
  "Id",
  "RecordTypeId",
  "OwnerId",
  "CreatedById",
  "LastModifiedById",
  // API/Integration fields
  "apiKey",
  "apiSecret",
  "accessToken",
  "refreshToken",
  "authToken",
  "sessionId",
  "bearerToken",
  // HTTP Action responses
  "HTTP_Response",
  "HTTP_Status",
  "HTTP_Headers",
  "httpResponse",
  "rawResponse",
  // Timestamps (internal)
  "TimeStamp",
  "Timestamp",
  "timestamp",
  "createdDate",
  "lastModifiedDate",
  // Error/Debug
  "errorMessage",
  "stackTrace",
  "debugInfo",
  // Content Version IDs (File uploads should show name, not ID)
  "ContentVersionId",
  "ContentDocumentId",
  "DocumentId"
]);

/**
 * Security blocklist prefixes - fields starting with these are excluded
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
 * @slot FormFormReview
 * @description OmniStudio Form Review component that displays collected answers for user review.
 * Automatically generates Summary List sections from OmniScript data.
 *
 * ## Known Risks Addressed
 * - Ghost Data: Cross-references omniJsonData against active step visibility
 * - Label vs Value: Supports labelSchema for option value lookup
 * - Performance: Depth-limited recursion with debounced regeneration
 * - LWS Proxy: Uses shallow hash comparison instead of JSON.stringify
 * - Security: Comprehensive blocklist with O(1) lookup
 * - Edit Navigation: Uses step name-based navigation for conditional step safety
 * - AODA: Preserves Block structure with subsections
 *
 * ## LWR/LWS Compatibility
 * - Uses OmniscriptBaseMixin for OmniScript integration
 * - Accesses omniJsonData to read all collected answers
 * - Uses dispatchOmniEventUtil for navigation
 * - LWS-safe: No JSON.stringify on proxy objects for change detection
 *
 * ## OmniScript Configuration
 * - Type: Custom LWC
 * - LWC Name: sfGpsDsCaOnFormFormReview
 * - Place in the final step of the OmniScript
 *
 * ## Custom Properties (set in OmniScript Designer JSON Editor)
 * - heading: Page heading (e.g., "Review your answers")
 * - subheading: Instructional text
 * - submitLabel: Submit button label (default: "Submit")
 * - cancelLabel: Cancel button label (default: "Save for later")
 * - showSubmitWarning: Whether to show warning before submit
 * - submitWarningMessage: Warning message text
 * - autoGenerate: Auto-generate sections from OmniScript data (default: true)
 * - excludeSteps: Comma-separated list of step names to exclude
 * - excludeFields: Comma-separated list of field paths to exclude
 * - fieldMapping: JSON object mapping field paths to display labels
 * - labelSchema: JSON object mapping field values to display labels
 * - sectionsJson: Manual sections JSON (overrides auto-generate)
 *
 * ## Output
 * - Dispatches 'omnisave' event on submit
 * - Dispatches 'omniautoadvance' for navigation
 */
export default class SfGpsDsCaOnFormFormReview extends OmniscriptBaseMixin(
  LightningElement
) {
  /* ========================================
   * PRIVATE PROPERTIES
   * ======================================== */

  /** @type {Array} Generated sections for display */
  @track _generatedSections = [];

  /** @type {string} Status message for screen readers */
  @track _statusMessage = "";

  /** @type {Object} Diagnostic data for debug panel */
  @track _diagnosticData = null;

  /** @type {boolean} Whether component has been initialized */
  _initialized = false;

  /** @type {number} Debounce timer ID */
  _regenerateTimer = null;

  /** @type {string} Hash of last processed data (for change detection) */
  _lastDataHash = "";

  /** @type {Set<string>} Active (visible) step names */
  _activeStepNames = new Set();

  /** @type {Map<string, Object>} Element definitions by path - CACHED once */
  _elementDefsByPath = new Map();

  /** @type {boolean} Whether element definitions have been indexed */
  _definitionsIndexed = false;

  /** @type {FormReviewLogger} Logger instance */
  _logger = new FormReviewLogger();

  /** @type {FormReviewSchemaValidator} Schema validator instance */
  _schemaValidator = new FormReviewSchemaValidator();

  /** @type {Object} Schema validation result */
  _schemaValidationResult = null;

  /** @type {string} Detected OmniStudio version */
  _detectedVersion = "unknown";

  /* ========================================
   * COMPUTED PROPERTIES - CONFIGURATION
   * ======================================== */

  /**
   * Access standard OmniStudio properties from jsonDef.propSetMap
   * @returns {Object}
   */
  get _propSetMap() {
    return this.jsonDef?.propSetMap || {};
  }

  /**
   * Access custom properties added via JSON Editor.
   * OmniStudio nests custom propSetMap inside the standard propSetMap.
   * @returns {Object}
   */
  get _customPropSetMap() {
    return this.jsonDef?.propSetMap?.propSetMap || {};
  }

  /**
   * Page heading
   * @returns {string}
   */
  get heading() {
    return (
      this._customPropSetMap?.heading ||
      this._propSetMap?.heading ||
      "Review your answers"
    );
  }

  /**
   * Page subheading/instructions
   * @returns {string}
   */
  get subheading() {
    return (
      this._customPropSetMap?.subheading ||
      this._propSetMap?.subheading ||
      "Please check your answers before submitting."
    );
  }

  /**
   * Submit button label
   * @returns {string}
   */
  get submitLabel() {
    return (
      this._customPropSetMap?.submitLabel ||
      this._propSetMap?.submitLabel ||
      "Submit"
    );
  }

  /**
   * Cancel button label
   * @returns {string}
   */
  get cancelLabel() {
    return (
      this._customPropSetMap?.cancelLabel ||
      this._propSetMap?.cancelLabel ||
      "Save for later"
    );
  }

  /**
   * Whether to show submit warning
   * @returns {boolean}
   */
  get showSubmitWarning() {
    return Boolean(
      this._customPropSetMap?.showSubmitWarning ||
      this._propSetMap?.showSubmitWarning
    );
  }

  /**
   * Submit warning message
   * @returns {string}
   */
  get submitWarningMessage() {
    return (
      this._customPropSetMap?.submitWarningMessage ||
      this._propSetMap?.submitWarningMessage ||
      "You cannot change your answers after submitting."
    );
  }

  /**
   * Whether to auto-generate sections from OmniScript data
   * @returns {boolean}
   */
  get autoGenerate() {
    const value =
      this._customPropSetMap?.autoGenerate ?? this._propSetMap?.autoGenerate;
    return value !== false; // Default to true
  }

  /**
   * Steps to exclude from auto-generation
   * @returns {Set<string>}
   */
  get excludeSteps() {
    const excludeStr =
      this._customPropSetMap?.excludeSteps || this._propSetMap?.excludeSteps;
    if (!excludeStr) return new Set();
    return new Set(
      excludeStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  /**
   * Fields to exclude from auto-generation
   * @returns {Set<string>}
   */
  get excludeFields() {
    const excludeStr =
      this._customPropSetMap?.excludeFields || this._propSetMap?.excludeFields;
    if (!excludeStr) return new Set();
    return new Set(
      excludeStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }

  /**
   * Field mapping for display labels
   * @returns {Object}
   */
  get fieldMapping() {
    try {
      const mappingStr =
        this._customPropSetMap?.fieldMapping ||
        this._propSetMap?.fieldMapping ||
        "{}";
      return typeof mappingStr === "string"
        ? JSON.parse(mappingStr)
        : mappingStr;
    } catch {
      return {};
    }
  }

  /**
   * Label schema for option value lookup
   * Maps raw values to human-readable labels
   * Format: { "fieldPath": { "opt_1": "Option One", "opt_2": "Option Two" } }
   * @returns {Object}
   */
  get labelSchema() {
    try {
      const schemaStr =
        this._customPropSetMap?.labelSchema || this._propSetMap?.labelSchema;
      if (!schemaStr) return {};
      return typeof schemaStr === "string" ? JSON.parse(schemaStr) : schemaStr;
    } catch {
      return {};
    }
  }

  /**
   * Manual sections JSON (overrides auto-generate)
   * @returns {Array|null}
   */
  get manualSections() {
    try {
      const sectionsStr =
        this._customPropSetMap?.sectionsJson || this._propSetMap?.sectionsJson;
      if (!sectionsStr) return null;
      return typeof sectionsStr === "string"
        ? JSON.parse(sectionsStr)
        : sectionsStr;
    } catch {
      return null;
    }
  }

  /* ========================================
   * OBSERVABILITY PROPERTIES
   * ======================================== */

  /**
   * Whether debug mode is enabled
   * Set via JSON Editor: debugMode: true
   * @returns {boolean}
   */
  get debugMode() {
    return Boolean(
      this._customPropSetMap?.debugMode || this._propSetMap?.debugMode
    );
  }

  /**
   * Whether debug panel should be shown
   * Set via JSON Editor: debugPanel: true
   * @returns {boolean}
   */
  get debugPanel() {
    // Also check URL parameter
    const urlParams = new URLSearchParams(window?.location?.search || "");
    const urlDebug = urlParams.get("formReviewDebug") === "true";
    return Boolean(
      this._customPropSetMap?.debugPanel ||
      this._propSetMap?.debugPanel ||
      urlDebug
    );
  }

  /**
   * Log level setting
   * @returns {string}
   */
  get logLevel() {
    return (
      this._customPropSetMap?.logLevel || this._propSetMap?.logLevel || "warn"
    );
  }

  /**
   * Whether strict mode is enabled (throw errors instead of fallbacks)
   * @returns {boolean}
   */
  get strictMode() {
    return Boolean(
      this._customPropSetMap?.strictMode || this._propSetMap?.strictMode
    );
  }

  /**
   * Get diagnostic data for debug panel
   * @returns {Object|null}
   */
  get diagnostics() {
    if (!this.debugPanel) return null;
    return this._diagnosticData;
  }

  /* ========================================
   * COMPUTED PROPERTIES - SECTIONS
   * ======================================== */

  /**
   * Sections to display - either manual or auto-generated
   * @returns {Array}
   */
  get sections() {
    // Manual sections take precedence
    if (this.manualSections && Array.isArray(this.manualSections)) {
      return this.manualSections;
    }

    // Otherwise use auto-generated sections
    return this._generatedSections;
  }

  /**
   * Whether there are sections to display
   * @returns {boolean}
   */
  get hasSections() {
    return this.sections && this.sections.length > 0;
  }

  /* ========================================
   * LWS-SAFE CHANGE DETECTION
   * Risk 1 Fix: Replace JSON.stringify with shallow hash
   * ======================================== */

  /**
   * Compute a shallow hash of omniJsonData without using JSON.stringify
   * This is LWS proxy-safe and maintains reactive connections
   * @param {Object} data - The omniJsonData object (may be LWS Proxy)
   * @returns {string} A hash string for change detection
   * @private
   */
  computeShallowHash(data) {
    if (!data) return "";

    try {
      // Use Object.keys which is proxy-safe
      const keys = Object.keys(data);
      if (keys.length === 0) return "empty";

      // Count fields in each step (shallow - don't recurse deeply)
      let fieldCount = 0;
      let valueSignature = "";

      for (const key of keys) {
        const stepData = data[key];
        if (
          stepData &&
          typeof stepData === "object" &&
          !Array.isArray(stepData)
        ) {
          const stepKeys = Object.keys(stepData);
          fieldCount += stepKeys.length;
          // Sample first value for change detection
          if (stepKeys.length > 0) {
            const firstVal = stepData[stepKeys[0]];
            const valType = typeof firstVal;
            valueSignature += `${valType}:`;
            if (
              valType === "string" ||
              valType === "number" ||
              valType === "boolean"
            ) {
              valueSignature += String(firstVal).substring(0, 20);
            }
          }
        } else if (Array.isArray(stepData)) {
          fieldCount += stepData.length;
        }
      }

      // Hash: step count + first key + last key + field count + value signature
      return `${keys.length}:${keys[0] || ""}:${keys[keys.length - 1] || ""}:${fieldCount}:${valueSignature.substring(0, 100)}`;
    } catch {
      // If proxy access fails, return timestamp to force regeneration
      return `fallback:${Date.now()}`;
    }
  }

  /* ========================================
   * GHOST DATA DETECTION
   * ======================================== */

  /**
   * Build a set of active (visible) step names from the OmniScript definition
   * This prevents displaying data from conditionally hidden steps
   * @private
   */
  buildActiveStepSet() {
    this._activeStepNames.clear();

    try {
      const children = this.omniScriptHeaderDef?.children || [];

      for (const child of children) {
        // Check if step is active/visible
        const isActive = this.isStepActive(child);

        if (isActive && child.name) {
          this._activeStepNames.add(child.name);
        }
      }
    } catch {
      // If we can't determine active steps, fall back to showing all
      // This is safer than hiding valid data
    }
  }

  /**
   * Check if a step is currently active (visible) in the OmniScript
   * @param {Object} stepDef - Step definition object
   * @returns {boolean}
   * @private
   */
  isStepActive(stepDef) {
    if (!stepDef) return false;

    // Check propSetMap for show/hide conditions
    // Risk 2 Fix: Use fallback property paths
    const propSetMap = stepDef.propSetMap || {};

    // If there's a show condition that evaluated to false, step is inactive
    if (propSetMap.show === false) return false;

    // If the step was dynamically hidden by conditional logic
    if (stepDef.bHidden === true) return false;

    // Check if step's conditional expression is false
    // OmniScript sets this when step visibility conditions aren't met
    if (stepDef.bShow === false) return false;

    // Check the response object for runtime visibility state
    if (stepDef.response?.hidden === true) return false;

    return true;
  }

  /**
   * Index element definitions by path for label/option lookup
   * Risk 2 Fix: Cache definitions once, add depth limit, use fallback properties
   * @private
   */
  indexElementDefinitionsOnce() {
    // Only index once per component lifecycle
    if (this._definitionsIndexed) return;

    this._elementDefsByPath.clear();

    try {
      const children = this.omniScriptHeaderDef?.children || [];

      for (const child of children) {
        if (child.name) {
          this.indexElementDefinitionsRecursive(child.name, child, 0);
        }
      }

      this._definitionsIndexed = true;
    } catch {
      // Fail silently - label lookup will use fallbacks
    }
  }

  /**
   * Recursively index element definitions with depth limiting
   * @param {string} basePath - Base path (step name)
   * @param {Object} def - Element definition
   * @param {number} depth - Current recursion depth
   * @private
   */
  indexElementDefinitionsRecursive(basePath, def, depth) {
    // Risk 2 Fix: Prevent unbounded recursion
    if (depth >= MAX_INDEX_DEPTH) return;
    if (!def) return;

    // Store this element's definition
    if (def.name) {
      const path = basePath === def.name ? def.name : `${basePath}:${def.name}`;
      this._elementDefsByPath.set(path, def);
    }

    // Recursively index children
    if (def.eleArray && Array.isArray(def.eleArray)) {
      for (const child of def.eleArray) {
        if (child && child.name) {
          const childPath = `${basePath}:${child.name}`;
          this.indexElementDefinitionsRecursive(childPath, child, depth + 1);
        }
      }
    }

    if (def.children && Array.isArray(def.children)) {
      for (const child of def.children) {
        if (child) {
          this.indexElementDefinitionsRecursive(basePath, child, depth + 1);
        }
      }
    }
  }

  /**
   * Check if data belongs to an active (visible) step
   * @param {string} stepName - Step name from omniJsonData
   * @returns {boolean}
   * @private
   */
  isStepDataActive(stepName) {
    // If we couldn't build the active set, default to showing
    if (this._activeStepNames.size === 0) return true;

    return this._activeStepNames.has(stepName);
  }

  /* ========================================
   * LABEL SCHEMA LOOKUP
   * ======================================== */

  /**
   * Get display label from element definition with fallback chain and audit logging
   * Risk 2 Fix: Use fallback property paths (label || caption || text || name)
   * @param {Object} def - Element definition
   * @param {string} elementPath - Element path for logging
   * @returns {string|null}
   * @private
   */
  getElementLabel(def, elementPath = "") {
    if (!def) return null;

    // Use schema validator's fallback chain
    const result = this._schemaValidator.getPropertyWithFallback(
      def,
      LABEL_PROPERTY_PATHS,
      (primary, fallback) => {
        this._logger.logFallback(
          "label",
          primary,
          fallback,
          elementPath,
          "Consider adding explicit label in labelSchema configuration"
        );
      }
    );

    return result.value || null;
  }

  /**
   * Look up a human-readable label for a raw option value
   * @param {string} fieldPath - Field path (e.g., "Step1:shippingMethod")
   * @param {*} rawValue - Raw value from JSON
   * @returns {string|null} Human-readable label or null if not found
   * @private
   */
  lookupLabel(fieldPath, rawValue) {
    // First check the labelSchema configuration (explicit, won't break)
    const fieldLabels = this.labelSchema[fieldPath];
    if (fieldLabels && fieldLabels[rawValue]) {
      return fieldLabels[rawValue];
    }

    // Try to find the element definition with options
    const elementDef = this._elementDefsByPath.get(fieldPath);
    if (elementDef?.propSetMap?.options) {
      const options = elementDef.propSetMap.options;
      if (Array.isArray(options)) {
        const match = options.find(
          (opt) => opt.value === rawValue || opt.name === rawValue
        );
        if (match) {
          // Risk 2 Fix: Fallback property paths for option labels
          return match.label || match.text || match.caption || match.name;
        }
      }
    }

    return null;
  }

  /* ========================================
   * AUTO-GENERATION METHODS
   * ======================================== */

  /**
   * Generate sections from OmniScript data with debouncing
   * @private
   */
  scheduleRegenerate() {
    if (this._regenerateTimer) {
      clearTimeout(this._regenerateTimer);
    }

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this._regenerateTimer = setTimeout(() => {
      this.generateSectionsFromOmniData();
    }, REGENERATE_DEBOUNCE_MS);
  }

  /**
   * Generate sections from OmniScript data
   * @private
   */
  generateSectionsFromOmniData() {
    if (!this.autoGenerate || !this.omniJsonData) {
      this._generatedSections = [];
      return;
    }

    // Risk 1 Fix: Use shallow hash instead of JSON.stringify (LWS proxy-safe)
    const dataHash = this.computeShallowHash(this.omniJsonData);
    if (dataHash === this._lastDataHash) {
      this._logger.debug(
        LOG_EVENTS.REGENERATION_SKIPPED,
        "Data unchanged, skipping regeneration",
        {}
      );
      return; // No change, skip regeneration
    }
    this._lastDataHash = dataHash;

    // Build active step set for ghost data detection
    this.buildActiveStepSet();

    // Risk 2 Fix: Index definitions once (cached)
    this.indexElementDefinitionsOnce();

    const sections = [];
    const stepDefs = this.getStepDefinitions();

    this._logger.debug(
      LOG_EVENTS.STEP_PROCESSED,
      `Processing ${Object.keys(this.omniJsonData).length} data keys`,
      { stepCount: Object.keys(this.omniJsonData).length }
    );

    // Process each step
    for (const [stepName, stepData] of Object.entries(this.omniJsonData)) {
      // Skip excluded steps
      if (this.excludeSteps.has(stepName)) {
        this._logger.debug(
          LOG_EVENTS.STEP_SKIPPED,
          `Step excluded by configuration: ${stepName}`,
          { stepName, reason: "excludeSteps" }
        );
        continue;
      }

      // Skip internal OmniScript fields
      if (this.isInternalField(stepName)) {
        this._logger.debug(
          LOG_EVENTS.STEP_SKIPPED,
          `Internal field skipped: ${stepName}`,
          { stepName, reason: "internal" }
        );
        continue;
      }

      // Skip non-object values (primitive step data is unusual)
      if (!stepData || typeof stepData !== "object") continue;

      // GHOST DATA CHECK: Skip steps that are not active/visible
      if (!this.isStepDataActive(stepName)) {
        this._logger.info(
          LOG_EVENTS.STEP_SKIPPED,
          `Ghost data detected: ${stepName} (step not active)`,
          { stepName, reason: "ghostData" }
        );
        continue;
      }

      // Get step label from definitions or format step name
      const stepDef = stepDefs[stepName];
      // Risk 2 Fix: Use fallback property paths
      const stepLabel =
        this.getElementLabel(stepDef, stepName) || this.formatLabel(stepName);

      // Risk 4 Fix: Extract fields preserving Block structure
      const { items, subsections } = this.extractFieldsWithStructure(
        stepName,
        stepData,
        0
      );

      if (items.length > 0 || subsections.length > 0) {
        sections.push({
          heading: stepLabel,
          headingActionLabel: "Change",
          // Use step NAME for navigation, not index (safer for conditional steps)
          headingActionUrl: `stepname:${stepName}`,
          items: items,
          subsections: subsections,
          ratio: "1-2"
        });

        this._logger.incrementSectionsGenerated();
        this._logger.debug(
          LOG_EVENTS.STEP_PROCESSED,
          `Section created: ${stepLabel}`,
          {
            stepName,
            itemCount: items.length,
            subsectionCount: subsections.length
          }
        );
      }
    }

    this._generatedSections = sections;

    // Update diagnostics after regeneration
    this._updateDiagnosticData();

    this._logger.info(
      LOG_EVENTS.STEP_PROCESSED,
      `Render complete: ${sections.length} sections`,
      {
        sectionCount: sections.length,
        totalItems: sections.reduce((sum, s) => sum + s.items.length, 0),
        totalSubsections: sections.reduce(
          (sum, s) => sum + (s.subsections?.length || 0),
          0
        )
      }
    );
  }

  /**
   * Get step definitions from OmniScript header
   * @returns {Object} Map of step name to definition
   * @private
   */
  getStepDefinitions() {
    const stepDefs = {};
    try {
      const children = this.omniScriptHeaderDef?.children || [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.eleArray || child.name) {
          // This is a step
          const stepName = child.name || child.eleArray?.[0]?.name;
          if (stepName) {
            stepDefs[stepName] = {
              ...child,
              indexInParent: i
            };
          }
        }
      }
    } catch {
      // Fail silently
    }
    return stepDefs;
  }

  /**
   * Risk 4 Fix: Extract display items preserving Block structure (AODA cognitive grouping)
   * @param {string} stepName - Step name
   * @param {Object} stepData - Step data object
   * @param {number} depth - Current recursion depth
   * @returns {Object} { items: Array, subsections: Array }
   * @private
   */
  extractFieldsWithStructure(stepName, stepData, depth = 0) {
    // PERFORMANCE: Prevent deep recursion that causes mobile freezes
    if (depth >= MAX_RECURSION_DEPTH) {
      this._logger.warn(
        LOG_EVENTS.DEPTH_LIMIT_REACHED,
        `Max recursion depth (${MAX_RECURSION_DEPTH}) reached at ${stepName}`,
        { stepName, depth: MAX_RECURSION_DEPTH }
      );
      return { items: [], subsections: [] };
    }

    const items = [];
    const subsections = [];

    for (const [fieldName, fieldValue] of Object.entries(stepData)) {
      const fieldPath = `${stepName}:${fieldName}`;

      // SECURITY: Check blocklist with O(1) lookup
      if (SECURITY_BLOCKLIST.has(fieldName)) continue;

      // SECURITY: Check blocklist prefixes
      if (this.isBlocklistedPrefix(fieldName)) continue;

      // Skip excluded fields (user configuration)
      if (this.excludeFields.has(fieldPath)) continue;
      if (this.excludeFields.has(fieldName)) continue;

      // Skip internal fields
      if (this.isInternalField(fieldName)) continue;

      // Risk 3 Fix: Skip null/undefined values (handles array gaps)
      if (fieldValue === null || fieldValue === undefined) continue;

      // Risk 3 Fix: Handle arrays with null gaps (Edit Block repeatable data)
      if (Array.isArray(fieldValue)) {
        // Check if this is an Edit Block array (array of objects)
        if (
          fieldValue.length > 0 &&
          typeof fieldValue[0] === "object" &&
          fieldValue[0] !== null
        ) {
          // This is likely an Edit Block - create subsection
          this._logger.info(
            LOG_EVENTS.EDIT_BLOCK_DETECTED,
            `Edit Block detected: ${fieldPath}`,
            { fieldPath, itemCount: fieldValue.length }
          );

          const editBlockItems = this.extractEditBlockItems(
            fieldPath,
            fieldValue
          );
          if (editBlockItems.length > 0) {
            const blockDef = this._elementDefsByPath.get(fieldPath);
            const blockLabel =
              this.getElementLabel(blockDef, fieldPath) ||
              this.formatLabel(fieldName);
            subsections.push({
              heading: blockLabel,
              headingActionLabel: "Change",
              headingActionUrl: fieldPath,
              items: editBlockItems,
              ratio: "1-2"
            });

            this._logger.debug(
              LOG_EVENTS.SUBSECTION_CREATED,
              `Subsection created: ${blockLabel}`,
              { fieldPath, itemCount: editBlockItems.length }
            );
          }
          continue;
        }

        // Simple array - format as comma-separated
        const displayLabel =
          this.fieldMapping[fieldPath] || this.formatLabel(fieldName);
        const displayValue = this.formatArrayValue(fieldValue, fieldPath);
        if (displayValue) {
          items.push({
            key: displayLabel,
            value: displayValue,
            changeLabel: "Change",
            changeUrl: fieldPath,
            ariaLabel: `Change your answer for ${displayLabel}`
          });
        }
        continue;
      }

      // Risk 4 Fix: Handle nested objects (Blocks) as subsections
      if (typeof fieldValue === "object" && !this.isSpecialObject(fieldValue)) {
        // Check if this looks like a Block (has multiple fields)
        const nestedKeys = Object.keys(fieldValue).filter(
          (k) => !this.isInternalField(k) && !SECURITY_BLOCKLIST.has(k)
        );

        if (nestedKeys.length > 1) {
          // Treat as a subsection (Block)
          const { items: blockItems, subsections: nestedSubs } =
            this.extractFieldsWithStructure(fieldPath, fieldValue, depth + 1);

          if (blockItems.length > 0 || nestedSubs.length > 0) {
            const blockDef = this._elementDefsByPath.get(fieldPath);
            const blockLabel =
              this.getElementLabel(blockDef, fieldPath) ||
              this.formatLabel(fieldName);
            subsections.push({
              heading: blockLabel,
              headingActionLabel: "Change",
              headingActionUrl: fieldPath,
              items: blockItems,
              subsections: nestedSubs,
              ratio: "1-2"
            });

            this._logger.debug(
              LOG_EVENTS.SUBSECTION_CREATED,
              `Block subsection created: ${blockLabel}`,
              {
                fieldPath,
                itemCount: blockItems.length,
                nestedSubsections: nestedSubs.length
              }
            );
          }
          continue;
        }

        // Single-field object - flatten into parent
        const { items: nestedItems } = this.extractFieldsWithStructure(
          fieldPath,
          fieldValue,
          depth + 1
        );
        items.push(...nestedItems);
        continue;
      }

      // Get display label from mapping or format field name
      const displayLabel =
        this.fieldMapping[fieldPath] || this.formatLabel(fieldName);

      // Format the value for display (with label lookup)
      const displayValue = this.formatValue(fieldValue, fieldPath);

      // Provide fallback for empty values (AODA compliance)
      const finalValue = displayValue || "Not provided";

      items.push({
        key: displayLabel,
        value: finalValue,
        changeLabel: "Change",
        changeUrl: fieldPath,
        // Enhanced ARIA label for screen readers
        ariaLabel: `Change your answer for ${displayLabel}`
      });

      this._logger.incrementFieldsProcessed();
      this._logger.debug(
        LOG_EVENTS.FIELD_EXTRACTED,
        `Field extracted: ${displayLabel}`,
        { fieldPath, hasValue: Boolean(displayValue) }
      );
    }

    return { items, subsections };
  }

  /**
   * Risk 3 Fix: Extract items from Edit Block array with null gap handling
   * @param {string} fieldPath - Field path
   * @param {Array} arrayData - Array of objects (with possible null gaps)
   * @returns {Array} Flattened items with original indices preserved
   * @private
   */
  extractEditBlockItems(fieldPath, arrayData) {
    const items = [];

    // Filter out null gaps and track original indices
    arrayData.forEach((item, originalIndex) => {
      // Risk 3 Fix: Skip null/undefined gaps from deleted items
      if (item === null || item === undefined) {
        this._logger.logNullGapFiltered(fieldPath, originalIndex);
        return;
      }

      if (typeof item === "object") {
        // For each field in the Edit Block row
        for (const [key, value] of Object.entries(item)) {
          if (this.isInternalField(key)) continue;
          if (SECURITY_BLOCKLIST.has(key)) continue;
          if (value === null || value === undefined) continue;

          const itemPath = `${fieldPath}[${originalIndex}]:${key}`;
          const displayLabel = this.formatLabel(key);
          const displayValue = this.formatValue(value, itemPath);

          if (displayValue) {
            items.push({
              key: `${displayLabel} (Item ${originalIndex + 1})`,
              value: displayValue,
              changeLabel: "Change",
              // Risk 3 Fix: Preserve original index for navigation
              changeUrl: `${fieldPath}[${originalIndex}]`,
              ariaLabel: `Change ${displayLabel} for item ${originalIndex + 1}`
            });
          }
        }
      }
    });

    return items;
  }

  /**
   * Risk 3 Fix: Format array value with null gap filtering
   * @param {Array} value - Array value (may have null gaps)
   * @param {string} fieldPath - Field path for label lookup
   * @returns {string} Formatted value
   * @private
   */
  formatArrayValue(value, fieldPath) {
    return value
      .filter((v) => v !== null && v !== undefined) // Filter gaps
      .map((v, idx) => this.formatValue(v, `${fieldPath}[${idx}]`))
      .filter(Boolean)
      .join(", ");
  }

  /**
   * Check if field name has a blocklisted prefix
   * @param {string} fieldName - Field name
   * @returns {boolean}
   * @private
   */
  isBlocklistedPrefix(fieldName) {
    const lowerName = fieldName.toLowerCase();
    for (const prefix of SECURITY_BLOCKLIST_PREFIXES) {
      if (lowerName.startsWith(prefix.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if object is a "special" object that should be formatted, not recursed
   * @param {Object} obj - Object to check
   * @returns {boolean}
   * @private
   */
  isSpecialObject(obj) {
    // File upload objects
    if (obj.name && obj.size !== undefined) return true;
    if (obj.ContentVersionId || obj.ContentDocumentId) return true;

    // Option selection objects
    if (obj.label !== undefined && obj.value !== undefined) return true;

    // Date objects
    if (obj instanceof Date) return true;

    return false;
  }

  /**
   * Check if field is an internal OmniScript field
   * @param {string} fieldName - Field name
   * @returns {boolean}
   * @private
   */
  isInternalField(fieldName) {
    // Fast blocklist check
    if (SECURITY_BLOCKLIST.has(fieldName)) return true;

    // Prefix check
    return this.isBlocklistedPrefix(fieldName);
  }

  /**
   * Format a field name as a display label
   * @param {string} name - Field name
   * @returns {string} Formatted label
   * @private
   */
  formatLabel(name) {
    if (!name) return "";

    // Remove common prefixes
    let label = name.replace(/^(txt|sel|cb|rad|num|date|time|cur)_?/i, "");

    // Insert spaces before capitals (camelCase to words)
    label = label.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Replace underscores with spaces
    label = label.replace(/_/g, " ");

    // Capitalize first letter of each word
    label = label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return label;
  }

  /**
   * Format a value for display with label lookup support
   * @param {*} value - Field value
   * @param {string} fieldPath - Field path for label lookup
   * @returns {string} Formatted value
   * @private
   */
  formatValue(value, fieldPath = "") {
    if (value === null || value === undefined) return "";

    // Boolean
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Array (including multi-select) - Risk 3 Fix: use formatArrayValue
    if (Array.isArray(value)) {
      return this.formatArrayValue(value, fieldPath);
    }

    // Object with label (option selection) - use label directly
    if (typeof value === "object" && value.label) {
      return value.label;
    }

    // File upload object - Risk 5 Fix: Multiple filename fallbacks
    if (typeof value === "object" && value.name && value.size !== undefined) {
      const sizeKB = Math.round(value.size / 1024);
      return `${value.name} (${sizeKB} KB)`;
    }

    // ContentVersion reference - Risk 5 Fix: Multiple filename fallbacks with audit
    if (
      typeof value === "object" &&
      (value.ContentVersionId || value.ContentDocumentId)
    ) {
      // Use fallback chain with logging
      const result = this._schemaValidator.getPropertyWithFallback(
        value,
        FILENAME_PROPERTY_PATHS,
        (primary, fallback) => {
          this._logger.logFallback(
            "fileName",
            primary,
            fallback,
            fieldPath,
            "File upload may need explicit fileName property"
          );
        }
      );
      return result.value || "Uploaded file";
    }

    // String value - check for label lookup
    if (typeof value === "string") {
      // Check labelSchema for human-readable label
      const label = this.lookupLabel(fieldPath, value);
      if (label) return label;

      // Handle semicolon-delimited multi-select values
      if (value.includes(";")) {
        return value
          .split(";")
          .map((v) => {
            const trimmed = v.trim();
            return this.lookupLabel(fieldPath, trimmed) || trimmed;
          })
          .filter(Boolean)
          .join(", ");
      }

      // Date string formatting
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
          const date = new Date(value);
          // Check for valid date
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
          }
        } catch {
          // Fall through to return raw value
        }
      }

      return value;
    }

    // Number
    if (typeof value === "number") {
      // Format numbers with locale
      return value.toLocaleString("en-CA");
    }

    // Fallback: convert to string (but not [Object object])
    if (typeof value === "object") {
      // Don't return complex JSON or IDs to users
      return "[Data]";
    }

    return String(value);
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handle submit button click
   * @param {Event} event
   */
  handleSubmit(event) {
    event.preventDefault();

    this.announceStatus("Submitting...");

    // Use dispatchOmniEventUtil for proper OmniScript integration
    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(this, {}, "omnisave");
    } else {
      // Fallback: dispatch standard event
      this.dispatchEvent(
        new CustomEvent("omnisave", {
          bubbles: true,
          composed: true
        })
      );
    }
  }

  /**
   * Handle cancel button click
   * @param {Event} event
   */
  handleCancel(event) {
    event.preventDefault();

    this.announceStatus("Saving for later...");

    // Use dispatchOmniEventUtil to save draft and navigate away
    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(this, { saveForLater: true }, "omnisave");
    } else {
      this.dispatchEvent(
        new CustomEvent("cancel", {
          bubbles: true,
          composed: true
        })
      );
    }
  }

  /**
   * Handle change link click - navigate back to step
   * Uses step NAME for safer navigation with conditional steps
   * @param {CustomEvent} event - Event with stepUrl in detail
   */
  handleChangeClick(event) {
    const changeUrl = event.detail?.changeUrl;
    if (!changeUrl) return;

    // Prevent default link navigation
    event.preventDefault();

    // Parse the change URL
    if (changeUrl.startsWith("stepname:")) {
      // Navigate by step name (safer for conditional steps)
      const stepName = changeUrl.replace("stepname:", "");
      this.navigateToStepByName(stepName);
    } else if (changeUrl.startsWith("step:")) {
      // Legacy: Direct step navigation by index
      const stepIndex = parseInt(changeUrl.replace("step:", ""), 10);
      this.navigateToStep(stepIndex);
    } else if (changeUrl.includes(":")) {
      // Field path - extract step name and navigate
      // Handle array indices: "Step:EditBlock[2]:field" -> "Step"
      const stepName = changeUrl.split(":")[0];
      this.navigateToStepByName(stepName);
    }
  }

  /**
   * Navigate to a step by name (safer for conditional steps)
   * @param {string} stepName - Step name
   * @private
   */
  navigateToStepByName(stepName) {
    this._logger.debug(
      LOG_EVENTS.NAVIGATION_REQUESTED,
      `Navigation requested to step: ${stepName}`,
      { stepName }
    );

    const stepDefs = this.getStepDefinitions();
    const stepDef = stepDefs[stepName];

    if (stepDef) {
      // Risk 2 Fix: Use fallback property paths
      const stepLabel = this.getElementLabel(stepDef, stepName) || stepName;
      this.announceStatus(`Navigating to ${stepLabel}...`);

      // Navigate using the step's index
      if (stepDef.indexInParent !== undefined) {
        this._logger.info(
          LOG_EVENTS.NAVIGATION_RESOLVED,
          `Navigating to step index ${stepDef.indexInParent}`,
          { stepName, stepIndex: stepDef.indexInParent, stepLabel }
        );
        this.navigateToStep(stepDef.indexInParent);
      }
    } else {
      this._logger.warn(
        LOG_EVENTS.NAVIGATION_REQUESTED,
        `Step "${stepName}" not found in definitions`,
        { stepName, availableSteps: Object.keys(stepDefs) }
      );
    }
  }

  /**
   * Navigate to a specific step by index
   * @param {number} stepIndex - Step index
   * @private
   */
  navigateToStep(stepIndex) {
    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(
        this,
        { moveToStep: stepIndex },
        "omniautoadvance"
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("omniautoadvance", {
          bubbles: true,
          composed: true,
          detail: { moveToStep: stepIndex }
        })
      );
    }
  }

  /**
   * Announce a status message for screen readers
   * @param {string} message
   * @private
   */
  announceStatus(message) {
    this._statusMessage = "";
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._statusMessage = message;
    }, 100);
  }

  /**
   * Handle clear logs from diagnostic panel
   */
  handleClearLogs() {
    this._logger.clearHistory();
    this._updateDiagnosticData();
  }

  /**
   * Handle close debug panel
   * Note: This just hides the panel for this session; to permanently disable,
   * remove debugPanel from configuration
   */
  handleCloseDebugPanel() {
    this._diagnosticData = null;
  }

  /* ========================================
   * VALIDATION METHODS
   * ======================================== */

  /**
   * Check if component is valid
   * Form Review is always valid - it's display-only
   * @returns {boolean}
   */
  @api
  checkValidity() {
    return true;
  }

  /**
   * Report validity
   * @returns {boolean}
   */
  @api
  reportValidity() {
    return true;
  }

  /**
   * Set custom validity (no-op for display component)
   * @param {string} message
   */
  @api
  setCustomValidity() {
    // No-op - Form Review is display-only
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  connectedCallback() {
    this.classList.add("caon-scope");

    // Configure logger
    this._logger.configure({
      debugMode: this.debugMode,
      logLevel: this.logLevel
    });

    this._logger.info(LOG_EVENTS.INIT_START, "FormReview initializing", {
      debugMode: this.debugMode,
      debugPanel: this.debugPanel,
      autoGenerate: this.autoGenerate
    });

    // Run schema validation
    this._runSchemaValidation();

    // Risk 2 Fix: Index definitions once at startup
    this.indexElementDefinitionsOnce();

    // Generate sections on initial load
    this.generateSectionsFromOmniData();
    this._initialized = true;

    // Update diagnostic data
    this._updateDiagnosticData();

    this._logger.info(LOG_EVENTS.INIT_COMPLETE, "FormReview initialized", {
      sectionsGenerated: this._generatedSections.length,
      detectedVersion: this._detectedVersion
    });
  }

  renderedCallback() {
    // Re-generate sections if OmniScript data changes (with debounce)
    if (this._initialized && this.autoGenerate) {
      this.scheduleRegenerate();
    }
  }

  disconnectedCallback() {
    // Clean up timer
    if (this._regenerateTimer) {
      clearTimeout(this._regenerateTimer);
    }
  }

  /* ========================================
   * OBSERVABILITY METHODS
   * ======================================== */

  /**
   * Run schema validation on OmniScript data structures
   * @private
   */
  _runSchemaValidation() {
    // Validate omniJsonData
    const dataResult = this._schemaValidator.validateOmniJsonData(
      this.omniJsonData
    );

    // Validate header definition
    const headerResult = this._schemaValidator.validateHeaderDef(
      this.omniScriptHeaderDef
    );

    // Combine results
    this._schemaValidationResult = {
      isValid: dataResult.isValid && headerResult.isValid,
      warnings: [...dataResult.warnings, ...headerResult.warnings],
      errors: [...dataResult.errors, ...headerResult.errors],
      detectedVersion: headerResult.detectedVersion
    };

    this._detectedVersion = headerResult.detectedVersion;

    // Log validation results
    if (this._schemaValidationResult.isValid) {
      this._logger.info(
        LOG_EVENTS.SCHEMA_VALIDATE,
        `Schema validation passed (${this._schemaValidationResult.warnings.length} warnings)`,
        {
          version: this._detectedVersion,
          warningCount: this._schemaValidationResult.warnings.length
        }
      );
    } else {
      this._logger.error(LOG_EVENTS.SCHEMA_ERROR, "Schema validation failed", {
        errors: this._schemaValidationResult.errors
      });
    }

    // Log warnings
    for (const warning of this._schemaValidationResult.warnings) {
      this._logger.warn(
        LOG_EVENTS.SCHEMA_WARNING,
        warning.message,
        warning.context
      );
    }

    // Version detection logging
    if (this._detectedVersion !== "unknown") {
      this._logger.info(
        LOG_EVENTS.VERSION_DETECTED,
        `OmniStudio version detected: ${this._detectedVersion}`,
        { version: this._detectedVersion }
      );
    } else {
      this._logger.warn(
        LOG_EVENTS.VERSION_UNKNOWN,
        "Could not detect OmniStudio version - using fallback mode",
        {}
      );
    }
  }

  /**
   * Update diagnostic data for debug panel
   * @private
   */
  _updateDiagnosticData() {
    if (!this.debugPanel) return;

    const logSummary = this._logger.getSummary();

    this._diagnosticData = {
      version: this._detectedVersion,
      schemaStatus: this._schemaValidationResult?.isValid ? "Valid" : "Invalid",
      warnings: this._schemaValidationResult?.warnings || [],
      errors: this._schemaValidationResult?.errors || [],
      stats: logSummary.stats,
      dataStructure: this._buildDataStructureSummary(),
      recentLogs: logSummary.recentLogs,
      fallbacksUsed: logSummary.stats.fallbacksUsed
    };
  }

  /**
   * Build a summary of the data structure for diagnostic display
   * @returns {Array}
   * @private
   */
  _buildDataStructureSummary() {
    if (!this.omniJsonData) return [];

    const summary = [];

    try {
      for (const [stepName, stepData] of Object.entries(this.omniJsonData)) {
        if (this.isInternalField(stepName)) continue;

        const fieldCount =
          stepData && typeof stepData === "object"
            ? Object.keys(stepData).filter((k) => !this.isInternalField(k))
                .length
            : 0;

        const isActive = this.isStepDataActive(stepName);

        // Count null gaps in arrays
        let nullGaps = 0;
        if (stepData && typeof stepData === "object") {
          for (const value of Object.values(stepData)) {
            if (Array.isArray(value)) {
              nullGaps += value.filter((v) => v === null).length;
            }
          }
        }

        summary.push({
          name: stepName,
          fieldCount,
          isActive,
          nullGaps,
          hasSubsections:
            this._generatedSections.find(
              (s) =>
                s.heading === stepName || s.headingActionUrl?.includes(stepName)
            )?.subsections?.length > 0
        });
      }
    } catch (e) {
      this._logger.error(
        LOG_EVENTS.SCHEMA_ERROR,
        "Failed to build data structure summary",
        { error: e.message }
      );
    }

    return summary;
  }

  /**
   * Get diagnostic summary for external access
   * @returns {Object}
   */
  @api
  getDiagnostics() {
    this._updateDiagnosticData();
    return this._diagnosticData;
  }

  /**
   * Get logger instance for external access
   * @returns {FormReviewLogger}
   */
  @api
  getLogger() {
    return this._logger;
  }

  /**
   * Clear log history
   */
  @api
  clearLogs() {
    this._logger.clearHistory();
    this._updateDiagnosticData();
  }
}
