/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export {
  //focusObjectGenerator,
  //getFocusableElement,
  //  getFocusableElementBySelector,
  //trapTabKey,
  //whichTransitionEvent,
  uniqueId,
  isIPadPro
} from "./utilities";

export { parseIso8601 } from "./datetimeutilv3";

export {
  htmlDecode,
  replaceInnerHtml,
  getFirstChild,
  computeClass,
  isRTL,
  HtmlSanitizer
<<<<<<< HEAD
} from "./domutilv3";
=======
} from "./domutil";
>>>>>>> main

export {
  findAllTabbableElements,
  findAllFocusableNodes,
  getElementWithFocus,
  filterTooltips
} from "./focus";

<<<<<<< HEAD
export { deepCopy, arraysEqual } from "./jsutilv3";
=======
export { deepCopy, arraysEqual } from "./jsutil";
>>>>>>> main

export { nextTick } from "./nextTick";
