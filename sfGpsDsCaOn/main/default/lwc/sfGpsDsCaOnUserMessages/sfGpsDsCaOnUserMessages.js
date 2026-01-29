/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * User-friendly message utility for Ontario Design System components.
 *
 * Ontario Design System requires error messages to be:
 * - In plain language (no technical jargon)
 * - Explain what went wrong
 * - Provide guidance on what to do next
 * - Accessible and actionable
 * - Available in both English and French
 *
 * This module uses Salesforce Custom Labels for i18n support.
 * Labels are automatically translated based on user's language setting.
 *
 * @module sfGpsDsCaOnUserMessages
 * @see https://designsystem.ontario.ca/components/detail/error-messages.html
 */

import { LABELS } from "c/sfGpsDsCaOnLabels";

/**
 * Gets user-friendly error messages from Custom Labels.
 * Messages are automatically translated based on user's language.
 */
function getUserMessages() {
  return {
    // Network/Connection Errors
    NETWORK_ERROR: {
      title: LABELS.Error.NetworkTitle,
      message: LABELS.Error.NetworkMessage,
      action: LABELS.Error.ActionTryAgain
    },
    TIMEOUT_ERROR: {
      title: LABELS.Error.TimeoutTitle,
      message: LABELS.Error.TimeoutMessage,
      action: LABELS.Error.ActionTryAgain
    },

    // Search/Location Errors
    SEARCH_NO_RESULTS: {
      title: LABELS.Error.SearchNoResultsTitle,
      message: LABELS.Error.SearchNoResultsMessage,
      action: null
    },
    LOCATION_NOT_FOUND: {
      title: LABELS.Error.LocationNotFoundTitle,
      message: LABELS.Error.LocationNotFoundMessage,
      action: null
    },
    LOCATION_OUTSIDE_ONTARIO: {
      title: LABELS.Error.LocationOutsideOntarioTitle,
      message: LABELS.Error.LocationOutsideOntarioMessage,
      action: null
    },
    GEOLOCATION_DENIED: {
      title: LABELS.Error.LocationNotFoundTitle,
      message: LABELS.Error.LocationNotFoundMessage,
      action: null
    },
    GEOLOCATION_UNAVAILABLE: {
      title: LABELS.Error.LocationNotFoundTitle,
      message: LABELS.Error.LocationNotFoundMessage,
      action: null
    },

    // Map Errors
    MAP_LOAD_ERROR: {
      title: LABELS.Error.MapLoadTitle,
      message: LABELS.Error.MapLoadMessage,
      action: null
    },
    MAP_LAYER_ERROR: {
      title: LABELS.Error.MapLayerTitle,
      message: LABELS.Error.MapLayerMessage,
      action: null
    },

    // Form/Validation Errors
    REQUIRED_FIELD: {
      title: LABELS.Error.RequiredFieldTitle,
      message: LABELS.Error.RequiredFieldMessage,
      action: null
    },
    INVALID_FORMAT: {
      title: LABELS.Error.InvalidFormatTitle,
      message: LABELS.Error.InvalidFormatMessage,
      action: null
    },
    INVALID_DATE: {
      title: LABELS.Error.InvalidFormatTitle,
      message: LABELS.Error.InvalidDateMessage,
      action: null
    },
    INVALID_EMAIL: {
      title: LABELS.Error.InvalidFormatTitle,
      message: LABELS.Error.InvalidEmailMessage,
      action: null
    },
    INVALID_PHONE: {
      title: LABELS.Error.InvalidFormatTitle,
      message: LABELS.Error.InvalidPhoneMessage,
      action: null
    },
    INVALID_POSTAL_CODE: {
      title: LABELS.Error.InvalidFormatTitle,
      message: LABELS.Error.InvalidPostalCodeMessage,
      action: null
    },

    // API/Service Errors
    SERVICE_UNAVAILABLE: {
      title: LABELS.Error.ServiceUnavailableTitle,
      message: LABELS.Error.ServiceUnavailableMessage,
      action: LABELS.Error.ActionTryAgain
    },
    ELIGIBILITY_CHECK_ERROR: {
      title: LABELS.Error.EligibilityCheckTitle,
      message: LABELS.Error.EligibilityCheckMessage,
      action: LABELS.Error.ActionTryAgain
    },
    DATA_LOAD_ERROR: {
      title: LABELS.Error.DataLoadTitle,
      message: LABELS.Error.DataLoadMessage,
      action: LABELS.Error.ActionRefreshPage
    },
    SAVE_ERROR: {
      title: LABELS.Error.SaveTitle,
      message: LABELS.Error.SaveMessage,
      action: LABELS.Error.ActionTryAgain
    },

    // Authentication/Authorization
    SESSION_EXPIRED: {
      title: LABELS.Error.SessionExpiredTitle,
      message: LABELS.Error.SessionExpiredMessage,
      action: LABELS.Error.ActionSignIn
    },
    ACCESS_DENIED: {
      title: LABELS.Error.AccessDeniedTitle,
      message: LABELS.Error.AccessDeniedMessage,
      action: LABELS.Error.ActionContactSupport
    },

    // Configuration Errors
    CONFIGURATION_ERROR: {
      title: LABELS.Error.ConfigurationTitle,
      message: LABELS.Error.ConfigurationMessage,
      action: LABELS.Error.ActionContactSupport
    },

    // Generic Fallback
    GENERIC_ERROR: {
      title: LABELS.Error.GenericTitle,
      message: LABELS.Error.GenericMessage,
      action: LABELS.Error.ActionTryAgain
    }
  };
}

/**
 * Lazy-loaded user messages (for i18n support)
 */
let _userMessages = null;

/**
 * Gets the USER_MESSAGES object with current language translations.
 * @returns {Object} User messages catalog
 */
export function getUserMessagesMap() {
  if (!_userMessages) {
    _userMessages = getUserMessages();
  }
  return _userMessages;
}

// For backwards compatibility, export as USER_MESSAGES
// Note: This will use the labels at import time
export const USER_MESSAGES = getUserMessages();

/**
 * Classifies technical errors into user-friendly categories.
 * Maps technical error patterns to appropriate user messages.
 *
 * @param {Error|Object|string} error - The error to classify
 * @returns {string} The error category key from USER_MESSAGES
 */
export function classifyError(error) {
  if (!error) return "GENERIC_ERROR";

  const message = extractErrorMessage(error).toLowerCase();
  const status =
    error.status || error.statusCode || (error.body && error.body.statusCode);

  // HTTP status code based classification
  if (status) {
    if (status === 401 || status === 403) return "ACCESS_DENIED";
    if (status === 404) return "DATA_LOAD_ERROR";
    if (status === 408) return "TIMEOUT_ERROR";
    if (status === 500 || status === 502 || status === 503)
      return "SERVICE_UNAVAILABLE";
    if (status >= 500) return "SERVICE_UNAVAILABLE";
  }

  // Message pattern matching
  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("cors")
  ) {
    return "NETWORK_ERROR";
  }
  if (message.includes("timeout") || message.includes("timed out")) {
    return "TIMEOUT_ERROR";
  }
  if (
    message.includes("session") &&
    (message.includes("expired") || message.includes("invalid"))
  ) {
    return "SESSION_EXPIRED";
  }
  if (
    message.includes("permission") ||
    message.includes("unauthorized") ||
    message.includes("forbidden")
  ) {
    return "ACCESS_DENIED";
  }
  if (message.includes("not found") && !message.includes("location")) {
    return "DATA_LOAD_ERROR";
  }
  if (message.includes("location") && message.includes("not found")) {
    return "LOCATION_NOT_FOUND";
  }
  if (message.includes("geolocation") && message.includes("denied")) {
    return "GEOLOCATION_DENIED";
  }
  if (message.includes("geolocation")) {
    return "GEOLOCATION_UNAVAILABLE";
  }
  if (
    message.includes("map") &&
    (message.includes("load") || message.includes("error"))
  ) {
    return "MAP_LOAD_ERROR";
  }
  if (message.includes("required")) {
    return "REQUIRED_FIELD";
  }
  if (message.includes("invalid") && message.includes("email")) {
    return "INVALID_EMAIL";
  }
  if (
    message.includes("invalid") &&
    (message.includes("phone") || message.includes("telephone"))
  ) {
    return "INVALID_PHONE";
  }
  if (message.includes("invalid") && message.includes("date")) {
    return "INVALID_DATE";
  }
  if (message.includes("invalid") && message.includes("format")) {
    return "INVALID_FORMAT";
  }
  if (message.includes("eligibility") || message.includes("expression set")) {
    return "ELIGIBILITY_CHECK_ERROR";
  }
  if (
    message.includes("configuration") ||
    message.includes("api name") ||
    message.includes("procedure name")
  ) {
    return "CONFIGURATION_ERROR";
  }
  if (message.includes("save") || message.includes("update failed")) {
    return "SAVE_ERROR";
  }

  return "GENERIC_ERROR";
}

/**
 * Extracts a string message from various error formats.
 *
 * @param {Error|Object|string} error - The error to extract message from
 * @returns {string} The extracted error message
 */
export function extractErrorMessage(error) {
  if (!error) return "";

  if (typeof error === "string") {
    return error;
  }

  // Apex error format
  if (error.body && error.body.message) {
    return error.body.message;
  }

  // Standard Error object
  if (error.message) {
    return error.message;
  }

  // Try to stringify
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/**
 * Gets a user-friendly error message for display.
 * Messages are automatically translated based on user's language setting.
 *
 * @param {Error|Object|string} error - The technical error
 * @param {string} [context] - Optional context to help classify the error
 * @returns {Object} User-friendly message object with title, message, and action
 *
 * @example
 * try {
 *   await callApex();
 * } catch (error) {
 *   const userMessage = getUserFriendlyError(error, 'search');
 *   this._errorTitle = userMessage.title;
 *   this._errorMessage = userMessage.message;
 * }
 */
export function getUserFriendlyError(error, context) {
  const messages = getUserMessagesMap();
  const category = classifyError(error);
  const userMessage = messages[category] || messages.GENERIC_ERROR;

  // Log technical details for debugging (not shown to user)
  if (typeof console !== "undefined" && console.warn) {
    console.warn(
      "[UserMessage] Technical error:",
      extractErrorMessage(error),
      "Category:",
      category,
      "Context:",
      context
    );
  }

  return {
    ...userMessage,
    category,
    technicalMessage: extractErrorMessage(error) // For logging, not display
  };
}

/**
 * Formats a user-friendly error message for simple display.
 * Returns just the message text, suitable for error message components.
 * Messages are automatically translated.
 *
 * @param {Error|Object|string} error - The technical error
 * @param {string} [fallbackMessage] - Optional fallback if classification fails
 * @returns {string} User-friendly message text
 */
export function formatUserError(error, fallbackMessage) {
  const userMessage = getUserFriendlyError(error);
  const messages = getUserMessagesMap();
  return (
    userMessage.message || fallbackMessage || messages.GENERIC_ERROR.message
  );
}

/**
 * Gets a specific user message by key.
 * Messages are automatically translated.
 *
 * @param {string} key - The message key from USER_MESSAGES
 * @returns {Object} The message object
 */
export function getMessage(key) {
  const messages = getUserMessagesMap();
  return messages[key] || messages.GENERIC_ERROR;
}

export default {
  USER_MESSAGES,
  classifyError,
  extractErrorMessage,
  getUserFriendlyError,
  formatUserError,
  getMessage,
  getUserMessagesMap
};
