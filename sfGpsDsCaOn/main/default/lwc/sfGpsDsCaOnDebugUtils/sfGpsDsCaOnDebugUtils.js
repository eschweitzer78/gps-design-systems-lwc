/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Debug and Logging Utilities for sfGpsDsCaOn Components
 *
 * Provides consistent logging, tracing, and debugging capabilities
 * for Ontario Design System LWC components.
 *
 * ## Usage
 * ```javascript
 * import { Logger, debugMode, trace, measurePerformance } from 'c/sfGpsDsCaOnDebugUtils';
 *
 * // Create a logger for your component
 * const log = new Logger('SfGpsDsCaOnTextInput');
 *
 * // Use in your component
 * log.debug('Initializing component', { value: this.value });
 * log.info('User selected option', option);
 * log.warn('Deprecated property used', 'oldProp');
 * log.error('Failed to load data', error);
 * ```
 *
 * ## Enabling Debug Mode
 * - Set `window.sfGpsDsCaOnDebug = true` in browser console
 * - Or add `?debug=true` to URL
 * - Or set `localStorage.setItem('sfGpsDsCaOnDebug', 'true')`
 *
 * @module sfGpsDsCaOnDebugUtils
 */

/**
 * Log levels for filtering output
 * @readonly
 * @enum {number}
 */
export const LogLevel = Object.freeze({
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
});

/**
 * Default log level (ERROR only in production)
 * @type {number}
 */
let currentLogLevel = LogLevel.ERROR;

/**
 * Performance marks storage
 * @type {Map<string, number>}
 */
const performanceMarks = new Map();

/**
 * Component instance counter for unique IDs
 * @type {Map<string, number>}
 */
const instanceCounters = new Map();

/**
 * Checks if debug mode is enabled via various mechanisms.
 * Safe for LWS - uses try/catch for restricted APIs.
 *
 * @returns {boolean} True if debug mode is enabled
 */
export function isDebugEnabled() {
  try {
    // Check window global (set via browser console)
    if (typeof window !== "undefined" && window.sfGpsDsCaOnDebug === true) {
      return true;
    }

    // Check URL parameter
    if (typeof window !== "undefined" && window.location) {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("debug") === "true" ||
        params.get("sfGpsDsCaOnDebug") === "true"
      ) {
        return true;
      }
    }

    // Check localStorage
    if (typeof localStorage !== "undefined") {
      if (localStorage.getItem("sfGpsDsCaOnDebug") === "true") {
        return true;
      }
    }
  } catch {
    // LWS may restrict these - fail silently
  }

  return false;
}

/**
 * Sets the current log level.
 *
 * @param {number} level - LogLevel value
 */
export function setLogLevel(level) {
  if (level >= LogLevel.NONE && level <= LogLevel.TRACE) {
    currentLogLevel = level;
  }
}

/**
 * Gets the current log level.
 *
 * @returns {number} Current LogLevel
 */
export function getLogLevel() {
  return currentLogLevel;
}

/**
 * Enables debug mode programmatically.
 */
export function enableDebug() {
  currentLogLevel = LogLevel.DEBUG;
  try {
    if (typeof window !== "undefined") {
      window.sfGpsDsCaOnDebug = true;
    }
  } catch {
    // LWS restriction - ignore
  }
}

/**
 * Disables debug mode.
 */
export function disableDebug() {
  currentLogLevel = LogLevel.ERROR;
  try {
    if (typeof window !== "undefined") {
      window.sfGpsDsCaOnDebug = false;
    }
  } catch {
    // LWS restriction - ignore
  }
}

/**
 * Generates a unique instance ID for a component.
 * Useful for tracing multiple instances of the same component.
 *
 * @param {string} componentName - Name of the component class
 * @returns {string} Unique instance identifier (e.g., "SfGpsDsCaOnTextInput#3")
 */
export function generateInstanceId(componentName) {
  const count = (instanceCounters.get(componentName) || 0) + 1;
  instanceCounters.set(componentName, count);
  return `${componentName}#${count}`;
}

/**
 * Logger class for consistent component logging.
 *
 * @example
 * const log = new Logger('SfGpsDsCaOnDropdown');
 * log.debug('Options loaded', { count: options.length });
 */
export class Logger {
  /**
   * Creates a new Logger instance.
   *
   * @param {string} componentName - Name of the component (used as prefix)
   * @param {Object} [options] - Logger options
   * @param {boolean} [options.includeTimestamp=false] - Include timestamp in logs
   * @param {boolean} [options.includeInstanceId=false] - Include unique instance ID
   */
  constructor(componentName, options = {}) {
    this.componentName = componentName;
    this.includeTimestamp = options.includeTimestamp || false;
    this.includeInstanceId = options.includeInstanceId || false;
    this.instanceId = options.includeInstanceId
      ? generateInstanceId(componentName)
      : null;

    // Check debug mode on creation
    if (isDebugEnabled() && currentLogLevel < LogLevel.DEBUG) {
      currentLogLevel = LogLevel.DEBUG;
    }
  }

  /**
   * Formats the log prefix with component name, timestamp, etc.
   *
   * @returns {string} Formatted prefix
   * @private
   */
  _formatPrefix() {
    const parts = [];

    if (this.includeTimestamp) {
      parts.push(new Date().toISOString());
    }

    parts.push(`[${this.instanceId || this.componentName}]`);

    return parts.join(" ");
  }

  /**
   * Logs a trace-level message (most verbose).
   *
   * @param {string} method - Method name or context
   * @param {...any} args - Additional arguments to log
   */
  trace(method, ...args) {
    if (currentLogLevel >= LogLevel.TRACE) {
      console.log(`${this._formatPrefix()} TRACE ${method}`, ...args);
    }
  }

  /**
   * Logs a debug-level message.
   *
   * @param {string} message - Log message
   * @param {...any} args - Additional arguments to log
   */
  debug(message, ...args) {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(`${this._formatPrefix()} ${message}`, ...args);
    }
  }

  /**
   * Logs an info-level message.
   *
   * @param {string} message - Log message
   * @param {...any} args - Additional arguments to log
   */
  info(message, ...args) {
    if (currentLogLevel >= LogLevel.INFO) {
      console.info(`${this._formatPrefix()} ${message}`, ...args);
    }
  }

  /**
   * Logs a warning-level message.
   *
   * @param {string} message - Log message
   * @param {...any} args - Additional arguments to log
   */
  warn(message, ...args) {
    if (currentLogLevel >= LogLevel.WARN) {
      console.warn(`${this._formatPrefix()} ${message}`, ...args);
    }
  }

  /**
   * Logs an error-level message.
   *
   * @param {string} message - Log message
   * @param {Error|any} [error] - Error object or additional data
   * @param {...any} args - Additional arguments to log
   */
  error(message, error, ...args) {
    if (currentLogLevel >= LogLevel.ERROR) {
      console.error(
        `${this._formatPrefix()} ERROR: ${message}`,
        error,
        ...args
      );
    }
  }

  /**
   * Logs method entry (for tracing execution flow).
   *
   * @param {string} methodName - Name of the method
   * @param {Object} [params] - Method parameters
   */
  enter(methodName, params) {
    if (currentLogLevel >= LogLevel.TRACE) {
      console.log(`${this._formatPrefix()} > ${methodName}`, params || "");
    }
  }

  /**
   * Logs method exit (for tracing execution flow).
   *
   * @param {string} methodName - Name of the method
   * @param {any} [result] - Return value
   */
  exit(methodName, result) {
    if (currentLogLevel >= LogLevel.TRACE) {
      console.log(
        `${this._formatPrefix()} < ${methodName}`,
        result !== undefined ? result : ""
      );
    }
  }

  /**
   * Logs a state change.
   *
   * @param {string} property - Property that changed
   * @param {any} oldValue - Previous value
   * @param {any} newValue - New value
   */
  stateChange(property, oldValue, newValue) {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(`${this._formatPrefix()} State: ${property}`, {
        from: oldValue,
        to: newValue
      });
    }
  }

  /**
   * Logs an event dispatch.
   *
   * @param {string} eventName - Name of the event
   * @param {any} [detail] - Event detail
   */
  eventDispatch(eventName, detail) {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(
        `${this._formatPrefix()} Event: ${eventName}`,
        detail || ""
      );
    }
  }

  /**
   * Logs an event received.
   *
   * @param {string} eventName - Name of the event
   * @param {Event} event - The event object
   */
  eventReceived(eventName, event) {
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(
        `${this._formatPrefix()} Received: ${eventName}`,
        event?.detail || ""
      );
    }
  }

  /**
   * Starts a performance measurement.
   *
   * @param {string} label - Unique label for the measurement
   */
  timeStart(label) {
    const key = `${this.componentName}:${label}`;
    performanceMarks.set(key, performance.now());

    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(`${this._formatPrefix()} Timer started: ${label}`);
    }
  }

  /**
   * Ends a performance measurement and logs the duration.
   *
   * @param {string} label - Label used in timeStart
   * @returns {number} Duration in milliseconds
   */
  timeEnd(label) {
    const key = `${this.componentName}:${label}`;
    const startTime = performanceMarks.get(key);

    if (startTime === undefined) {
      this.warn(`Timer "${label}" was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    performanceMarks.delete(key);

    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(
        `${this._formatPrefix()} Timer ${label}: ${duration.toFixed(2)}ms`
      );
    }

    return duration;
  }

  /**
   * Creates a child logger with additional context.
   *
   * @param {string} context - Additional context (e.g., method name)
   * @returns {Logger} New logger with combined context
   */
  child(context) {
    return new Logger(`${this.componentName}:${context}`, {
      includeTimestamp: this.includeTimestamp,
      includeInstanceId: false
    });
  }
}

/**
 * Decorator-style function for tracing method execution.
 *
 * @param {string} componentName - Component name
 * @param {string} methodName - Method name
 * @param {Function} fn - Function to trace
 * @returns {Function} Wrapped function with tracing
 *
 * @example
 * this.handleClick = trace('MyComponent', 'handleClick', this.handleClick.bind(this));
 */
export function trace(componentName, methodName, fn) {
  const log = new Logger(componentName);

  return function (...args) {
    log.enter(methodName, args.length > 0 ? args : undefined);
    try {
      const result = fn.apply(this, args);

      // Handle promises
      if (result && typeof result.then === "function") {
        return result.then(
          (res) => {
            log.exit(methodName, res);
            return res;
          },
          (err) => {
            log.error(`${methodName} failed`, err);
            throw err;
          }
        );
      }

      log.exit(methodName, result);
      return result;
    } catch (error) {
      log.error(`${methodName} threw exception`, error);
      throw error;
    }
  };
}

/**
 * Measures the execution time of a function.
 *
 * @param {string} label - Label for the measurement
 * @param {Function} fn - Function to measure
 * @returns {any} Result of the function
 *
 * @example
 * const result = measurePerformance('loadData', () => this.fetchData());
 */
export function measurePerformance(label, fn) {
  const start = performance.now();
  try {
    const result = fn();

    // Handle promises
    if (result && typeof result.then === "function") {
      return result.finally(() => {
        const duration = performance.now() - start;
        if (currentLogLevel >= LogLevel.DEBUG) {
          console.debug(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
        }
      });
    }

    const duration = performance.now() - start;
    if (currentLogLevel >= LogLevel.DEBUG) {
      console.debug(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(
      `[Performance] ${label} failed after ${duration.toFixed(2)}ms`,
      error
    );
    throw error;
  }
}

/**
 * Assertion helper for debugging.
 * Only executes in debug mode.
 *
 * @param {boolean} condition - Condition that should be true
 * @param {string} message - Message if assertion fails
 */
export function debugAssert(condition, message) {
  if (currentLogLevel >= LogLevel.DEBUG && !condition) {
    console.error(`[Assertion Failed] ${message}`);
    // In debug mode, we might want to break
    // debugger; // Uncomment to break on assertion failure
  }
}

/**
 * Dumps component state to console (debug mode only).
 *
 * @param {string} componentName - Component name
 * @param {Object} state - State object to dump
 */
export function dumpState(componentName, state) {
  if (currentLogLevel >= LogLevel.DEBUG) {
    console.group(`[${componentName}] State Dump`);
    console.table(state);
    console.groupEnd();
  }
}

// Initialize log level based on environment
if (isDebugEnabled()) {
  currentLogLevel = LogLevel.DEBUG;
}
