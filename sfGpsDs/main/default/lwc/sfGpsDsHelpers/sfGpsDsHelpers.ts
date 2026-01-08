/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export { 
  styleToString 
} from "./cssutil";

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
} from "./datetimeutil";

export {
  htmlDecode,
  replaceInnerHtml,
  getFirstChild,
  computeClass,
  uniqueClassesFromString,
  isRTL,
  getCssPropertyValue,
  HtmlSanitizer
} from "./domutil";

export {
  deepCopy,
  arraysEqual,
  debounce,
  once,
  invokeArrayFns,
  hasChanged
} from "./jsutil";

export { 
  nextTick 
} from "./nextTick";

export {
  normaliseBoolean,
  normaliseArray,
  normaliseAriaAttribute,
  normaliseString,
  normaliseInteger
} from "./normalise";

export {
  formatTemplate,
  safeEqualsIgnoreCase,
  truncateText,
  capitalize,
  camelize,
  hyphenate
} from "./string";

export {
  isExternalUrl,
  isRelativeUrl,
  isAnchorLink,
  getAnchorLinkName,
  decodeSpecialCharacters
} from "./urlutil";

export { 
  uniqueId, 
  isIPadPro, 
  isMacPlatform 
} from "./utilities";

export {
  EMPTY_OBJ,
  EMPTY_ARR,
  NOOP,
  hasOwn,
  objectToString,
  toTypeString,
  toRawType,
  isPlainObject,
  isArray,
  isMap,
  isSet,
  isRegEx,
  isFunction,
  isString,
  isSymbol,
  isObject,
  isPromise,
  extend,
  def,
  toNumber,
  toArray
} from "./typeutil";

export { 
  withModifiers, 
  withKeys 
} from "./eventutil";