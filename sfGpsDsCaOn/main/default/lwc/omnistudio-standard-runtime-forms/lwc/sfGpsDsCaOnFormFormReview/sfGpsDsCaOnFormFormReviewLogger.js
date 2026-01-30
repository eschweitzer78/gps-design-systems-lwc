/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @fileoverview Structured logging utility for FormReview component
 * Provides configurable log levels, structured log entries, and audit trail support
 */

/**
 * Log levels in order of verbosity
 */
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

/**
 * Log event types for categorization
 */
export const LOG_EVENTS = {
  // Initialization
  INIT_START: "INIT_START",
  INIT_COMPLETE: "INIT_COMPLETE",

  // Schema validation
  SCHEMA_VALIDATE: "SCHEMA_VALIDATE",
  SCHEMA_WARNING: "SCHEMA_WARNING",
  SCHEMA_ERROR: "SCHEMA_ERROR",

  // Version detection
  VERSION_DETECTED: "VERSION_DETECTED",
  VERSION_UNKNOWN: "VERSION_UNKNOWN",

  // Data processing
  STEP_PROCESSED: "STEP_PROCESSED",
  STEP_SKIPPED: "STEP_SKIPPED",
  FIELD_EXTRACTED: "FIELD_EXTRACTED",
  FIELD_FILTERED: "FIELD_FILTERED",

  // Label resolution
  LABEL_LOOKUP: "LABEL_LOOKUP",
  LABEL_FALLBACK: "LABEL_FALLBACK",

  // Array/Edit Block handling
  NULL_GAP_FILTERED: "NULL_GAP_FILTERED",
  EDIT_BLOCK_DETECTED: "EDIT_BLOCK_DETECTED",
  SUBSECTION_CREATED: "SUBSECTION_CREATED",

  // Navigation
  NAVIGATION_REQUESTED: "NAVIGATION_REQUESTED",
  NAVIGATION_RESOLVED: "NAVIGATION_RESOLVED",

  // Performance
  DEPTH_LIMIT_REACHED: "DEPTH_LIMIT_REACHED",
  REGENERATION_SKIPPED: "REGENERATION_SKIPPED",

  // Self-healing
  FALLBACK_USED: "FALLBACK_USED",
  SELF_HEAL: "SELF_HEAL"
};

/**
 * FormReviewLogger - Structured logging for FormReview component
 */
export class FormReviewLogger {
  /** @type {string} Component name for log prefix */
  _componentName = "FormReview";

  /** @type {number} Current log level */
  _logLevel = LOG_LEVELS.WARN;

  /** @type {boolean} Whether debug mode is enabled */
  _debugMode = false;

  /** @type {Array} Log history for audit trail */
  _logHistory = [];

  /** @type {number} Maximum log history size */
  _maxHistorySize = 100;

  /** @type {Object} Statistics counters */
  _stats = {
    warnings: 0,
    errors: 0,
    fallbacksUsed: 0,
    sectionsGenerated: 0,
    fieldsProcessed: 0,
    nullGapsFiltered: 0
  };

  /**
   * Configure the logger
   * @param {Object} config - Configuration options
   * @param {boolean} config.debugMode - Enable verbose logging
   * @param {string} config.logLevel - Log level: 'error', 'warn', 'info', 'debug'
   * @param {number} config.maxHistorySize - Maximum log entries to keep
   */
  configure(config = {}) {
    this._debugMode = config.debugMode === true;

    if (config.logLevel) {
      const level = config.logLevel.toUpperCase();
      if (LOG_LEVELS[level] !== undefined) {
        this._logLevel = LOG_LEVELS[level];
      }
    }

    if (this._debugMode) {
      this._logLevel = LOG_LEVELS.DEBUG;
    }

    if (config.maxHistorySize) {
      this._maxHistorySize = config.maxHistorySize;
    }
  }

  /**
   * Create a structured log entry
   * @param {number} level - Log level
   * @param {string} event - Event type from LOG_EVENTS
   * @param {string} message - Human-readable message
   * @param {Object} context - Additional context data
   * @private
   */
  _createLogEntry(level, event, message, context = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      component: this._componentName,
      level:
        Object.keys(LOG_LEVELS).find((k) => LOG_LEVELS[k] === level) || "INFO",
      event,
      message,
      context
    };

    // Add to history
    this._logHistory.push(entry);
    if (this._logHistory.length > this._maxHistorySize) {
      this._logHistory.shift();
    }

    return entry;
  }

  /**
   * Log an error
   * @param {string} event - Event type
   * @param {string} message - Error message
   * @param {Object} context - Additional context
   */
  error(event, message, context = {}) {
    this._stats.errors++;
    const entry = this._createLogEntry(
      LOG_LEVELS.ERROR,
      event,
      message,
      context
    );

    if (this._logLevel >= LOG_LEVELS.ERROR) {
      console.error(`[${this._componentName}] ERROR: ${message}`, context);
    }

    return entry;
  }

  /**
   * Log a warning
   * @param {string} event - Event type
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  warn(event, message, context = {}) {
    this._stats.warnings++;
    const entry = this._createLogEntry(
      LOG_LEVELS.WARN,
      event,
      message,
      context
    );

    if (this._logLevel >= LOG_LEVELS.WARN) {
      console.warn(`[${this._componentName}] WARN: ${message}`, context);
    }

    return entry;
  }

  /**
   * Log info message
   * @param {string} event - Event type
   * @param {string} message - Info message
   * @param {Object} context - Additional context
   */
  info(event, message, context = {}) {
    const entry = this._createLogEntry(
      LOG_LEVELS.INFO,
      event,
      message,
      context
    );

    if (this._logLevel >= LOG_LEVELS.INFO) {
      console.info(`[${this._componentName}] INFO: ${message}`, context);
    }

    return entry;
  }

  /**
   * Log debug message
   * @param {string} event - Event type
   * @param {string} message - Debug message
   * @param {Object} context - Additional context
   */
  debug(event, message, context = {}) {
    const entry = this._createLogEntry(
      LOG_LEVELS.DEBUG,
      event,
      message,
      context
    );

    if (this._logLevel >= LOG_LEVELS.DEBUG) {
      console.debug(`[${this._componentName}] DEBUG: ${message}`, context);
    }

    return entry;
  }

  /**
   * Log a fallback being used (audit trail)
   * @param {string} property - Property that needed fallback
   * @param {string} primaryPath - Primary path that was tried
   * @param {string} fallbackUsed - Fallback that succeeded
   * @param {string} element - Element path
   * @param {string} recommendation - Recommendation for fixing
   */
  logFallback(
    property,
    primaryPath,
    fallbackUsed,
    element,
    recommendation = ""
  ) {
    this._stats.fallbacksUsed++;
    return this.warn(
      LOG_EVENTS.FALLBACK_USED,
      `${property}: using fallback "${fallbackUsed}" instead of "${primaryPath}"`,
      {
        property,
        primaryPath,
        fallbackUsed,
        element,
        recommendation:
          recommendation || `Consider using explicit ${property} configuration`
      }
    );
  }

  /**
   * Log a null gap being filtered
   * @param {string} fieldPath - Field path with null gap
   * @param {number} originalIndex - Original index of null item
   */
  logNullGapFiltered(fieldPath, originalIndex) {
    this._stats.nullGapsFiltered++;
    return this.debug(
      LOG_EVENTS.NULL_GAP_FILTERED,
      `Filtered null gap at index ${originalIndex}`,
      {
        fieldPath,
        originalIndex
      }
    );
  }

  /**
   * Increment fields processed counter
   */
  incrementFieldsProcessed() {
    this._stats.fieldsProcessed++;
  }

  /**
   * Increment sections generated counter
   */
  incrementSectionsGenerated() {
    this._stats.sectionsGenerated++;
  }

  /**
   * Get log history
   * @returns {Array} Log entries
   */
  getHistory() {
    return [...this._logHistory];
  }

  /**
   * Get statistics
   * @returns {Object} Stats counters
   */
  getStats() {
    return { ...this._stats };
  }

  /**
   * Get warnings from history
   * @returns {Array} Warning entries
   */
  getWarnings() {
    return this._logHistory.filter(
      (e) => e.level === "WARN" || e.level === "ERROR"
    );
  }

  /**
   * Clear log history
   */
  clearHistory() {
    this._logHistory = [];
    this._stats = {
      warnings: 0,
      errors: 0,
      fallbacksUsed: 0,
      sectionsGenerated: 0,
      fieldsProcessed: 0,
      nullGapsFiltered: 0
    };
  }

  /**
   * Generate summary for diagnostic panel
   * @returns {Object} Summary data
   */
  getSummary() {
    return {
      stats: this.getStats(),
      warnings: this.getWarnings(),
      recentLogs: this._logHistory.slice(-20)
    };
  }
}

// Default logger instance
export const formReviewLogger = new FormReviewLogger();
