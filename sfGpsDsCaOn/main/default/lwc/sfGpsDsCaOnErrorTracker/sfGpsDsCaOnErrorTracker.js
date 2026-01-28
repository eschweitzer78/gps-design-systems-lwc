/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Error Tracking and Correlation ID Utilities for sfGpsDsCaOn Components
 *
 * Provides centralized error tracking, correlation IDs for request tracing,
 * and integration with Apex logging.
 *
 * ## Features
 * - Unique correlation IDs for tracing requests across frontend/backend
 * - Structured error formatting for consistent logging
 * - Error severity classification
 * - User context collection (safe for LWS)
 * - Integration with Platform Events for centralized logging
 *
 * ## Usage
 * ```javascript
 * import { ErrorTracker, generateCorrelationId, formatError } from 'c/sfGpsDsCaOnErrorTracker';
 *
 * const tracker = new ErrorTracker('SfGpsDsCaOnMyComponent');
 *
 * try {
 *   await this.callApex();
 * } catch (error) {
 *   tracker.trackError(error, { action: 'loadData' });
 * }
 * ```
 *
 * @module sfGpsDsCaOnErrorTracker
 */

/**
 * Error severity levels
 * @readonly
 * @enum {string}
 */
export const ErrorSeverity = Object.freeze({
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL"
});

/**
 * Error categories for classification
 * @readonly
 * @enum {string}
 */
export const ErrorCategory = Object.freeze({
  NETWORK: "NETWORK",
  VALIDATION: "VALIDATION",
  AUTHORIZATION: "AUTHORIZATION",
  CONFIGURATION: "CONFIGURATION",
  RUNTIME: "RUNTIME",
  USER_INPUT: "USER_INPUT",
  INTEGRATION: "INTEGRATION",
  UNKNOWN: "UNKNOWN"
});

/**
 * Generates a unique correlation ID for request tracing.
 * Format: SFGPS-<timestamp>-<random>
 *
 * @returns {string} Unique correlation ID
 *
 * @example
 * const correlationId = generateCorrelationId();
 * // "SFGPS-1706450400123-a1b2c3d4"
 */
export function generateCorrelationId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `SFGPS-${timestamp}-${random}`;
}

/**
 * Formats an error object into a consistent structure.
 *
 * @param {Error|Object|string} error - The error to format
 * @param {Object} context - Additional context
 * @returns {Object} Formatted error object
 */
export function formatError(error, context = {}) {
  const formatted = {
    timestamp: new Date().toISOString(),
    correlationId: context.correlationId || generateCorrelationId(),
    severity: context.severity || ErrorSeverity.ERROR,
    category: context.category || classifyError(error),
    component: context.component || "Unknown",
    action: context.action || "Unknown",
    message: "",
    stack: null,
    details: {}
  };

  // Extract error information
  if (error instanceof Error) {
    formatted.message = error.message;
    formatted.stack = error.stack;
    formatted.details.name = error.name;
  } else if (typeof error === "object" && error !== null) {
    // Apex error format
    if (error.body) {
      formatted.message = error.body.message || JSON.stringify(error.body);
      formatted.details.statusCode = error.status;
      formatted.details.exceptionType = error.body.exceptionType;
      if (error.body.fieldErrors) {
        formatted.details.fieldErrors = error.body.fieldErrors;
      }
    } else {
      formatted.message = error.message || JSON.stringify(error);
    }
  } else {
    formatted.message = String(error);
  }

  // Add user context (LWS-safe)
  formatted.details.userContext = getUserContext();

  // Add custom context
  Object.assign(formatted.details, context.details || {});

  return formatted;
}

/**
 * Classifies an error into a category based on its characteristics.
 *
 * @param {Error|Object} error - The error to classify
 * @returns {string} Error category
 */
export function classifyError(error) {
  if (!error) return ErrorCategory.UNKNOWN;

  const message = (error.message || "").toLowerCase();
  const status = error.status || (error.body && error.body.statusCode);

  // Network errors
  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("timeout")
  ) {
    return ErrorCategory.NETWORK;
  }

  // Authorization errors
  if (
    status === 401 ||
    status === 403 ||
    message.includes("unauthorized") ||
    message.includes("permission")
  ) {
    return ErrorCategory.AUTHORIZATION;
  }

  // Validation errors
  if (
    message.includes("validation") ||
    message.includes("required") ||
    message.includes("invalid")
  ) {
    return ErrorCategory.VALIDATION;
  }

  // Configuration errors
  if (
    message.includes("configuration") ||
    message.includes("not found") ||
    message.includes("undefined")
  ) {
    return ErrorCategory.CONFIGURATION;
  }

  // Integration errors
  if (
    message.includes("apex") ||
    message.includes("callout") ||
    message.includes("external")
  ) {
    return ErrorCategory.INTEGRATION;
  }

  return ErrorCategory.RUNTIME;
}

/**
 * Collects user context information safely (LWS-compatible).
 *
 * @returns {Object} User context
 */
export function getUserContext() {
  const context = {
    timestamp: new Date().toISOString(),
    userAgent: null,
    url: null,
    screenSize: null
  };

  try {
    if (typeof navigator !== "undefined") {
      context.userAgent = navigator.userAgent;
    }
  } catch {
    // LWS restriction - ignore
  }

  try {
    if (typeof window !== "undefined" && window.location) {
      context.url = window.location.pathname;
    }
  } catch {
    // LWS restriction - ignore
  }

  try {
    if (typeof window !== "undefined" && window.screen) {
      context.screenSize = `${window.screen.width}x${window.screen.height}`;
    }
  } catch {
    // LWS restriction - ignore
  }

  return context;
}

/**
 * Error Tracker class for component-level error tracking.
 */
export class ErrorTracker {
  /**
   * Creates a new ErrorTracker instance.
   *
   * @param {string} componentName - Name of the component
   * @param {Object} options - Tracker options
   * @param {boolean} options.reportToApex - Whether to report errors to Apex (default: false)
   * @param {Function} options.onError - Callback when error is tracked
   */
  constructor(componentName, options = {}) {
    this.componentName = componentName;
    this.correlationId = generateCorrelationId();
    this.reportToApex = options.reportToApex || false;
    this.onError = options.onError || null;
    this._errors = [];
    this._maxErrors = options.maxErrors || 100;
  }

  /**
   * Gets the current correlation ID.
   *
   * @returns {string} Correlation ID
   */
  getCorrelationId() {
    return this.correlationId;
  }

  /**
   * Generates a new correlation ID (e.g., for new user session).
   *
   * @returns {string} New correlation ID
   */
  refreshCorrelationId() {
    this.correlationId = generateCorrelationId();
    return this.correlationId;
  }

  /**
   * Tracks an error with context.
   *
   * @param {Error|Object|string} error - The error to track
   * @param {Object} context - Additional context
   * @returns {Object} Formatted error object
   */
  trackError(error, context = {}) {
    const formatted = formatError(error, {
      ...context,
      component: this.componentName,
      correlationId: this.correlationId
    });

    // Store locally
    this._errors.push(formatted);
    if (this._errors.length > this._maxErrors) {
      this._errors.shift();
    }

    // Log to console
    console.error(
      `[${this.componentName}] ${formatted.category} Error [${formatted.correlationId}]:`,
      formatted.message,
      formatted
    );

    // Callback
    if (this.onError) {
      try {
        this.onError(formatted);
      } catch {
        // Don't let callback errors bubble
      }
    }

    // Report to Apex if enabled
    if (this.reportToApex) {
      this._reportToApex(formatted);
    }

    return formatted;
  }

  /**
   * Tracks a warning (non-critical issue).
   *
   * @param {string} message - Warning message
   * @param {Object} details - Additional details
   * @returns {Object} Formatted warning object
   */
  trackWarning(message, details = {}) {
    return this.trackError(new Error(message), {
      severity: ErrorSeverity.WARNING,
      details
    });
  }

  /**
   * Tracks an info-level message.
   *
   * @param {string} message - Info message
   * @param {Object} details - Additional details
   * @returns {Object} Formatted info object
   */
  trackInfo(message, details = {}) {
    const formatted = formatError(new Error(message), {
      component: this.componentName,
      correlationId: this.correlationId,
      severity: ErrorSeverity.INFO,
      details
    });

    console.info(
      `[${this.componentName}] Info [${formatted.correlationId}]:`,
      message
    );

    return formatted;
  }

  /**
   * Gets all tracked errors.
   *
   * @returns {Array} Array of formatted errors
   */
  getErrors() {
    return [...this._errors];
  }

  /**
   * Clears tracked errors.
   */
  clearErrors() {
    this._errors = [];
  }

  /**
   * Creates a child tracker with additional context.
   *
   * @param {string} subContext - Sub-context name
   * @returns {ErrorTracker} Child tracker
   */
  child(subContext) {
    const child = new ErrorTracker(`${this.componentName}:${subContext}`, {
      reportToApex: this.reportToApex,
      onError: this.onError
    });
    child.correlationId = this.correlationId;
    return child;
  }

  /**
   * Reports error to Apex controller for centralized logging.
   *
   * @param {Object} formattedError - Formatted error object
   * @private
   */
  async _reportToApex(formattedError) {
    // This is a placeholder - implement based on your Apex controller
    // Example: await logError({ errorJson: JSON.stringify(formattedError) });
    console.debug("[ErrorTracker] Would report to Apex:", formattedError);
  }
}

/**
 * Creates a wrapped function that automatically tracks errors.
 *
 * @param {ErrorTracker} tracker - Error tracker instance
 * @param {string} action - Action name for context
 * @param {Function} fn - Function to wrap
 * @returns {Function} Wrapped function
 *
 * @example
 * this.loadData = withErrorTracking(tracker, 'loadData', async () => {
 *   const result = await callApex();
 *   return result;
 * });
 */
export function withErrorTracking(tracker, action, fn) {
  return async function (...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      tracker.trackError(error, { action });
      throw error; // Re-throw for caller to handle
    }
  };
}

/**
 * Decorator-style wrapper for tracking Apex call errors.
 *
 * @param {ErrorTracker} tracker - Error tracker instance
 * @param {string} methodName - Apex method name
 * @param {Function} apexCall - Apex call function
 * @param {Object} params - Parameters for Apex call
 * @returns {Promise} Result of Apex call
 *
 * @example
 * const result = await trackApexCall(
 *   tracker,
 *   'getAccountData',
 *   getAccountData,
 *   { accountId: '001xxx' }
 * );
 */
export async function trackApexCall(
  tracker,
  methodName,
  apexCall,
  params = {}
) {
  const startTime = performance.now();

  try {
    const result = await apexCall(params);
    const duration = performance.now() - startTime;

    tracker.trackInfo(`Apex call completed: ${methodName}`, {
      duration: `${duration.toFixed(2)}ms`,
      params: Object.keys(params)
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    tracker.trackError(error, {
      action: `Apex: ${methodName}`,
      category: ErrorCategory.INTEGRATION,
      details: {
        duration: `${duration.toFixed(2)}ms`,
        params: Object.keys(params)
      }
    });

    throw error;
  }
}

/**
 * Global error handler for unhandled promise rejections.
 * Call once in your main component to catch unhandled errors.
 *
 * @param {ErrorTracker} tracker - Error tracker instance
 *
 * @example
 * connectedCallback() {
 *   installGlobalErrorHandler(this.tracker);
 * }
 */
export function installGlobalErrorHandler(tracker) {
  try {
    if (typeof window !== "undefined") {
      window.addEventListener("unhandledrejection", (event) => {
        tracker.trackError(event.reason || "Unhandled promise rejection", {
          action: "unhandledRejection",
          severity: ErrorSeverity.CRITICAL
        });
      });
    }
  } catch {
    // LWS restriction - ignore
  }
}
