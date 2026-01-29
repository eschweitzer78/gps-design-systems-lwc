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
 *
 * @module sfGpsDsCaOnUserMessages
 * @see https://designsystem.ontario.ca/components/detail/error-messages.html
 */

/**
 * User-friendly error messages mapped by error category.
 * These messages follow Ontario Design System plain language guidelines.
 */
export const USER_MESSAGES = {
  // Network/Connection Errors
  NETWORK_ERROR: {
    title: "Connection problem",
    message:
      "We couldn't connect to the server. Please check your internet connection and try again.",
    action: "Try again"
  },
  TIMEOUT_ERROR: {
    title: "Request timed out",
    message:
      "The request is taking longer than expected. Please try again in a few moments.",
    action: "Try again"
  },

  // Search/Location Errors
  SEARCH_NO_RESULTS: {
    title: "No results found",
    message:
      "We couldn't find any results for your search. Try using different keywords or check the spelling.",
    action: "Modify search"
  },
  LOCATION_NOT_FOUND: {
    title: "Location not found",
    message:
      "We couldn't find that address or location. Please check the spelling or try a different search.",
    action: "Try a different address"
  },
  LOCATION_OUTSIDE_ONTARIO: {
    title: "Location outside Ontario",
    message:
      "The selected location is outside of Ontario. This service is only available for Ontario locations.",
    action: "Select an Ontario location"
  },
  GEOLOCATION_DENIED: {
    title: "Location access denied",
    message:
      "You've blocked location access. To use your current location, please enable location services in your browser settings.",
    action: "Enable location services"
  },
  GEOLOCATION_UNAVAILABLE: {
    title: "Location unavailable",
    message:
      "We couldn't determine your current location. Please enter your address manually.",
    action: "Enter address manually"
  },

  // Map Errors
  MAP_LOAD_ERROR: {
    title: "Map unavailable",
    message:
      "We're having trouble loading the map. You can still enter your location using the search field.",
    action: "Use search instead"
  },
  MAP_LAYER_ERROR: {
    title: "Map layer unavailable",
    message:
      "Some map information couldn't be loaded. The basic map is still available.",
    action: null
  },

  // Form/Validation Errors
  REQUIRED_FIELD: {
    title: "Required information missing",
    message: "Please provide the required information to continue.",
    action: "Complete required fields"
  },
  INVALID_FORMAT: {
    title: "Invalid format",
    message:
      "The information you entered isn't in the right format. Please check and try again.",
    action: "Correct the format"
  },
  INVALID_DATE: {
    title: "Invalid date",
    message: "Please enter a valid date in the format DD/MM/YYYY.",
    action: "Correct the date"
  },
  INVALID_EMAIL: {
    title: "Invalid email address",
    message: "Please enter a valid email address (e.g., name@example.com).",
    action: "Correct the email"
  },
  INVALID_PHONE: {
    title: "Invalid phone number",
    message: "Please enter a valid phone number (e.g., 416-555-1234).",
    action: "Correct the phone number"
  },
  INVALID_POSTAL_CODE: {
    title: "Invalid postal code",
    message: "Please enter a valid Canadian postal code (e.g., M5V 3A8).",
    action: "Correct the postal code"
  },

  // API/Service Errors
  SERVICE_UNAVAILABLE: {
    title: "Service temporarily unavailable",
    message:
      "This service is temporarily unavailable. Please try again later or contact support if the problem continues.",
    action: "Try again later"
  },
  ELIGIBILITY_CHECK_ERROR: {
    title: "Unable to check eligibility",
    message:
      "We couldn't complete the eligibility check at this time. Please try again or contact support for assistance.",
    action: "Try again"
  },
  DATA_LOAD_ERROR: {
    title: "Unable to load data",
    message:
      "We couldn't load the required information. Please refresh the page and try again.",
    action: "Refresh page"
  },
  SAVE_ERROR: {
    title: "Unable to save",
    message:
      "We couldn't save your information. Please check your connection and try again.",
    action: "Try again"
  },

  // Authentication/Authorization
  SESSION_EXPIRED: {
    title: "Session expired",
    message:
      "Your session has expired for security reasons. Please sign in again to continue.",
    action: "Sign in"
  },
  ACCESS_DENIED: {
    title: "Access denied",
    message:
      "You don't have permission to access this feature. Please contact your administrator if you believe this is an error.",
    action: "Contact administrator"
  },

  // Configuration Errors (should rarely be shown to end users)
  CONFIGURATION_ERROR: {
    title: "Configuration issue",
    message:
      "There's a configuration issue with this application. Please contact support for assistance.",
    action: "Contact support"
  },

  // Generic Fallback (use sparingly)
  GENERIC_ERROR: {
    title: "Something went wrong",
    message:
      "We encountered an unexpected problem. Please try again or contact support if the issue continues.",
    action: "Try again"
  }
};

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
  const category = classifyError(error);
  const userMessage = USER_MESSAGES[category] || USER_MESSAGES.GENERIC_ERROR;

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
 *
 * @param {Error|Object|string} error - The technical error
 * @param {string} [fallbackMessage] - Optional fallback if classification fails
 * @returns {string} User-friendly message text
 */
export function formatUserError(error, fallbackMessage) {
  const userMessage = getUserFriendlyError(error);
  return (
    userMessage.message ||
    fallbackMessage ||
    USER_MESSAGES.GENERIC_ERROR.message
  );
}

/**
 * Gets a specific user message by key.
 *
 * @param {string} key - The message key from USER_MESSAGES
 * @returns {Object} The message object
 */
export function getMessage(key) {
  return USER_MESSAGES[key] || USER_MESSAGES.GENERIC_ERROR;
}

export default {
  USER_MESSAGES,
  classifyError,
  extractErrorMessage,
  getUserFriendlyError,
  formatUserError,
  getMessage
};
