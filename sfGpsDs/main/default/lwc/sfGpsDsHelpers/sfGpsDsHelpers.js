/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export { styleToString } from "./cssutil";

export {
  ISO8601_PATTERN,
  isDate,
  isValidDate,
  parseIso8601,
  formatDate,
  formatDateRange,
  getMonthNames,
  getUserLocale,
  getUserLocales
} from "./datetimeutil_v6";

export {
  htmlDecode,
  replaceInnerHtml,
  getFirstChild,
  computeClass,
  isRTL,
  HtmlSanitizer
} from "./domutil_v6";

export {
  findAllTabbableElements,
  findAllFocusableNodes,
  getElementWithFocus,
  filterTooltips
} from "./focus_v6";

export { deepCopy, arraysEqual, debounce } from "./jsutil_v6";

export { nextTick } from "./nextTick_v6";

export {
  normaliseBoolean,
  normaliseArray,
  normaliseAriaAttribute,
  normaliseString
} from "./normalise_v6";

export {
  formatTemplate,
  safeEqualsIgnoreCase,
  truncateText,
  capitalize
} from "./string_v6";

export {
  isExternalUrl,
  isRelativeUrl,
  isAnchorLink,
  getAnchorLinkName,
  decodeSpecialCharacters
} from "./urlutil";

export { uniqueId, isIPadPro, isMacPlatform } from "./utilities_v6";
