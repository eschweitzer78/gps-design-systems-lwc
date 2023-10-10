/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export {
  uniqueId,
  isIPadPro,
  isMacPlatform,
  isExternalUrl,
  truncateText
} from "./utilities_v6";

export {
  parseIso8601,
  formatDate,
  formatDateRange,
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
