/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export { uniqueId, isIPadPro, isMacPlatform } from "./utilities";

export { parseIso8601 } from "./datetimeutil";

export {
  htmlDecode,
  replaceInnerHtml,
  getFirstChild,
  computeClass,
  isRTL,
  HtmlSanitizer
} from "./domutil";

export {
  findAllTabbableElements,
  findAllFocusableNodes,
  getElementWithFocus,
  filterTooltips
} from "./focus";

export { deepCopy, arraysEqual, debounce } from "./jsutil";

export { nextTick } from "./nextTick";

export {
  normaliseBoolean,
  normaliseArray,
  normaliseAriaAttribute,
  normaliseString
} from "./normaliseOps";
