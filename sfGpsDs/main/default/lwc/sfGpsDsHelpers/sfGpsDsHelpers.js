/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export { uniqueId, isIPadPro, isMacPlatform } from "./utilities_v5";

export { parseIso8601 } from "./datetimeutil_v5";

export {
  htmlDecode,
  replaceInnerHtml,
  getFirstChild,
  computeClass,
  isRTL,
  HtmlSanitizer
} from "./domutil_v5";

export {
  findAllTabbableElements,
  findAllFocusableNodes,
  getElementWithFocus,
  filterTooltips
} from "./focus_v5";

export { deepCopy, arraysEqual, debounce } from "./jsutil_v5";

export { nextTick } from "./nextTick_v5";

export {
  normaliseBoolean,
  normaliseArray,
  normaliseAriaAttribute,
  normaliseString
} from "./normalise_v5";
