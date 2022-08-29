/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* TEMPORARY MEASURE UNTIL WE SORT OUT DEPLOYMENT ISSUES WITH THIS CLASS

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
} from "./domutilv3";

export {
  findAllTabbableElements,
  findAllFocusableNodes,
  getElementWithFocus,
  filterTooltips
} from "./focus";

export { deepCopy, arraysEqual } from "./jsutilv3";

export { nextTick } from "./nextTick";
*/

/* datetimeutil.js */

/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const numericKeys = [1, 4, 5, 6, 7, 10, 11];

export function parseIso8601(date) {
  /*
   * © 2011 Colin Snover <http://zetafleet.com>
   * Released under MIT license.
   */

  let timestamp,
    struct,
    minutesOffset = 0;

  // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
  // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
  // implementations could be faster
  //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
  if (
    (struct =
      /^(\d{4}|[+-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+-])(\d{2})(?::(\d{2}))?)?)?$/.exec(
        date
      ))
  ) {
    // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
    for (let i = 0, k; (k = numericKeys[i]); ++i) {
      struct[k] = +struct[k] || 0;
    }

    // allow undefined days and months
    struct[2] = (+struct[2] || 1) - 1;
    struct[3] = +struct[3] || 1;

    if (struct[8] !== "Z" && struct[9] !== undefined) {
      minutesOffset = struct[10] * 60 + struct[11];

      if (struct[9] === "+") {
        minutesOffset = 0 - minutesOffset;
      }
    }

    timestamp = Date.UTC(
      struct[1],
      struct[2],
      struct[3],
      struct[4],
      struct[5] + minutesOffset,
      struct[6],
      struct[7]
    );
  } else {
    timestamp = Date.parse(date);
  }

  return new Date(timestamp);
}

/* domutil.js */

/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const parser = new DOMParser();

/**
 * Replaces the element innerHTML with a new markup provided as a string.
 *
 * @param {Element} element
 * @param {String} markup - markup to place as the element's innerHtml
 */

export function replaceInnerHtml(element, markup) {
  // eslint-disable-next-line @lwc/lwc/no-inner-html
  element.innerHTML = markup;
}

/**
 * Decodes espaced html, e.g. what's store in Salesforce's CMS Rich Text fields into normal markup
 * for instance &lt;p;gt& to <p>.
 *
 * @param {String} markup escaped markup
 * @returns {String} unescaped markup
 */

export function htmlDecode(markup) {
  let htmlDoc = parser.parseFromString(markup, "text/html");
  let rn = htmlDoc.querySelector("body");

  return rn.childNodes.length === 0 ? "" : rn.childNodes[0].nodeValue;
}

/**
 * Returns the first element child of a parsed markup's body, e.g. "<div>a</div><p>Hello</p>" returns
 * "<div>a</div>"
 *
 * @param {String} markup
 * @returns {Element} first element child node
 */

export function getFirstChild(markup) {
  let htmlDoc = parser.parseFromString(markup, "text/html");
  let rn = htmlDoc.querySelector("body");

  return rn.firstElementChild;
}

export function computeClass(config) {
  let result = Object.keys(config)
    .filter((key) => config[key])
    .join(" ");
  return result ? result : null;
}

export function isRTL() {
  return document.dir === "rtl";
}

// JavaScript HTML Sanitizer v2.0.2, (c) Alexander Yumashev, Jitbit Software.
// homepage https://github.com/jitbit/HtmlSanitizer
// License: MIT https://github.com/jitbit/HtmlSanitizer/blob/master/LICENSE

const HtmlSanitizer = new (function () {
  const _tagWhitelist = {
    A: true,
    ABBR: true,
    B: true,
    BLOCKQUOTE: true,
    BODY: true,
    BR: true,
    CENTER: true,
    CODE: true,
    DD: true,
    DIV: true,
    DL: true,
    DT: true,
    EM: true,
    FONT: true,
    H1: true,
    H2: true,
    H3: true,
    H4: true,
    H5: true,
    H6: true,
    HR: true,
    I: true,
    IMG: true,
    LABEL: true,
    LI: true,
    OL: true,
    P: true,
    PRE: true,
    SMALL: true,
    SOURCE: true,
    SPAN: true,
    STRONG: true,
    SUB: true,
    SUP: true,
    TABLE: true,
    TBODY: true,
    TR: true,
    TD: true,
    TH: true,
    THEAD: true,
    UL: true,
    U: true,
    VIDEO: true
  };

  const _contentTagWhiteList = {
    FORM: true,
    "GOOGLE-SHEETS-HTML-ORIGIN": true
  }; //tags that will be converted to DIVs

  const _attributeWhitelist = {
    align: true,
    color: true,
    controls: true,
    height: true,
    href: true,
    id: true,
    src: true,
    style: true,
    target: true,
    title: true,
    type: true,
    width: true
  };

  const _cssWhitelist = {
    "background-color": true,
    color: true,
    "font-size": true,
    "font-weight": true,
    "text-align": true,
    "text-decoration": true,
    width: true
  };

  const _schemaWhiteList = [
    "http:",
    "https:",
    "data:",
    "m-files:",
    "file:",
    "ftp:",
    "mailto:",
    "pw:"
  ]; //which "protocols" are allowed in "href", "src" etc

  const _uriAttributes = { href: true, action: true };

  const _parser = new DOMParser();

  this.sanitize = function (input, extraSelector) {
    input = input.trim();
    if (input === "") return ""; //to save performance

    //firefox "bogus node" workaround for wysiwyg's
    if (input === "<br>") return "";

    if (input.indexOf("<body") === -1) input = "<body>" + input + "</body>"; //add "body" otherwise some tags are skipped, like <style>

    let doc = _parser.parseFromString(input, "text/html");

    //DOM clobbering check (damn you firefox)
    if (doc.body.tagName !== "BODY") doc.body.remove();
    if (typeof doc.createElement !== "function") doc.createElement.remove();

    function makeSanitizedCopy(node) {
      let newNode;
      if (node.nodeType === Node.TEXT_NODE) {
        newNode = node.cloneNode(true);
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        (_tagWhitelist[node.tagName] ||
          _contentTagWhiteList[node.tagName] ||
          (extraSelector && node.matches(extraSelector)))
      ) {
        //is tag allowed?

        if (_contentTagWhiteList[node.tagName])
          newNode = doc.createElement("DIV"); //convert to DIV
        else newNode = doc.createElement(node.tagName);

        for (let i = 0; i < node.attributes.length; i++) {
          let attr = node.attributes[i];
          if (_attributeWhitelist[attr.name]) {
            if (attr.name === "style") {
              for (let s = 0; s < node.style.length; s++) {
                let styleName = node.style[s];
                if (_cssWhitelist[styleName])
                  newNode.style.setProperty(
                    styleName,
                    node.style.getPropertyValue(styleName)
                  );
              }
            } else {
              if (_uriAttributes[attr.name]) {
                //if this is a "uri" attribute, that can have "javascript:" or something
                if (
                  attr.value.indexOf(":") > -1 &&
                  !startsWithAny(attr.value, _schemaWhiteList)
                )
                  continue;
              }
              newNode.setAttribute(attr.name, attr.value);
            }
          }
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          let subCopy = makeSanitizedCopy(node.childNodes[i]);
          newNode.appendChild(subCopy, false);
        }

        //remove useless empty spans (lots of those when pasting from MS Outlook)
        if (
          (newNode.tagName === "SPAN" ||
            newNode.tagName === "B" ||
            newNode.tagName === "I" ||
            newNode.tagName === "U") &&
          // eslint-disable-next-line @lwc/lwc/no-inner-html
          newNode.innerHTML.trim() === ""
        ) {
          return doc.createDocumentFragment();
        }
      } else {
        newNode = doc.createDocumentFragment();
      }
      return newNode;
    }

    let resultElement = makeSanitizedCopy(doc.body);

    // eslint-disable-next-line @lwc/lwc/no-inner-html
    return resultElement.innerHTML
      .replace(/<br[^>]*>(\S)/g, "<br>\n$1")
      .replace(/div><div/g, "div>\n<div"); //replace is just for cleaner code
  };

  function startsWithAny(str, substrings) {
    for (let i = 0; i < substrings.length; i++) {
      if (str.indexOf(substrings[i]) === 0) {
        return true;
      }
    }
    return false;
  }

  this.AllowedTags = _tagWhitelist;
  this.AllowedAttributes = _attributeWhitelist;
  this.AllowedCssStyles = _cssWhitelist;
  this.AllowedSchemas = _schemaWhiteList;
})();

export { HtmlSanitizer };

/* focus.js */

/**
 *
 * Returns all tabbable elements within a containing element. Tabbable elements are:
 * a visible/non-disabled element that has a tabIndex of 0 and is not within a custom
 * element with tabindex attribute of “-1" on it.
 *
 * @param {Element} container The element to search for tabbable element.
 * @returns {Array} Tabbable elements.
 */
export function findAllTabbableElements(container) {
  const result = [];

  traverseActiveTreeRecursively(container, (element) => {
    // Remove the try/catch once https://github.com/salesforce/lwc/issues/1421 is fixed
    try {
      if (isTabbable({ element, rootContainer: container })) {
        result.push(element);
      }
    } catch (e) {
      console.warn(e);
    }
  });
  return result;
}

const FOCUSABLE_NODES = /^input$|^select$|^textarea$|^a$|^button$/;

/**
 * Returns all focusable nodes within a containing element. Focusable nodes are
 * those which have a focus() method specified in the object definition spec:
 * https://www.w3.org/TR/DOM-Level-2-HTML/html.html
 *
 * Exception: button - Browsers today allow setting focus programmatically
 * on button elements + autofocus attribute present on HTMLButtonElement
 *
 * @param {Element} container The element to search for focusable nodes.
 * @returns {Array} Focusable elements.
 */
export function findAllFocusableNodes(container) {
  const result = [];
  traverseActiveTreeRecursively(container, (element) => {
    if (FOCUSABLE_NODES.test(element.tagName.toLowerCase())) {
      result.push(element);
    }
  });
  return result;
}

/**
 * Finds the element that currently has focus, even when the element is part of a shadow root or iframe.
 *
 * @returns {Element} Element that has focus.
 */
export function getElementWithFocus() {
  let currentFocusedElement = document.activeElement;
  while (currentFocusedElement) {
    if (currentFocusedElement.shadowRoot) {
      let nextFocusedElement = currentFocusedElement.shadowRoot.activeElement;
      if (nextFocusedElement) {
        currentFocusedElement = nextFocusedElement;
      } else {
        return currentFocusedElement;
      }
    } else if (currentFocusedElement.contentDocument) {
      let nextFocusedElement =
        currentFocusedElement.contentDocument.activeElement;
      if (nextFocusedElement) {
        currentFocusedElement = nextFocusedElement;
      } else {
        return currentFocusedElement;
      }
    } else {
      return currentFocusedElement;
    }
  }

  return undefined;
}

/**
 * Recursively traverse an active tree and run callback on each non-inert node element.
 *
 * @param {Node} node The starting node to recursively traverse.
 * @param {Function} callback Function to call on each node element.
 */
function traverseActiveTreeRecursively(node, callback) {
  if (!node) {
    return;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    // inert is only supported by Chrome for now (behind a flag)
    if (node.hasAttribute("inert")) {
      return;
    }
    if (isIframe(node)) {
      if (isIframeOfSameOrigin(node)) {
        // for a same-origin iframe, we don't want to include the
        // iframe itself in the list, since we can see any of the
        // frames focusable children. So, skip calling callback on
        // the iframe node, and proceed to traverse it's children.
        traverseActiveTreeRecursively(node.contentDocument, callback);
      } else {
        // a non same-origin iframe is totally opaque, so include the
        // iframe in the results, but do no try to traverse into the
        // iframes children
        if (callback) {
          callback(node);
        }
      }
      return;
    }
    if (callback) {
      callback(node);
    }
    // If the element has a shadow root, traverse that
    if (node.shadowRoot) {
      traverseActiveTreeRecursively(node.shadowRoot, callback);
      return;
    }
    // if it's a slot element, get all assigned nodes and traverse them
    if (node.localName === "slot") {
      const slottedNodes = node.assignedNodes({ flatten: true });
      for (let i = 0; i < slottedNodes.length; i++) {
        traverseActiveTreeRecursively(slottedNodes[i], callback);
      }
      return;
    }
  }
  let child = node.firstChild;
  while (child !== null) {
    traverseActiveTreeRecursively(child, callback);
    child = child.nextSibling;
  }
}

// returns true if iframe is same origin, and therefore, can focus its internal elements
function isIframe(node) {
  return node.tagName === "IFRAME" || node instanceof HTMLIFrameElement;
}

function isIframeOfSameOrigin(iframe) {
  // if we can access contentDocument (is not null) on the iframe, then it is of same origin
  return !!iframe.contentDocument;
}

const ELEMENTS_WITH_DISABLED_ATTRIBUTE = [
  "button",
  "select",
  "textarea",
  "input"
];

// https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
const ELEMENTS_WITH_TABINDEX_ZERO_BY_DEFAULT = [
  "a",
  "select",
  "textarea",
  "input",
  "button",
  "iframe",
  "object",
  "area",
  "frame"
];

function isTabbable({ element, rootContainer }) {
  const elementLocalName = element.localName;

  if (elementLocalName === "input" && elementLocalName.type === "hidden") {
    return false;
  }

  const tabIndexAttribute = element.getAttribute("tabindex");
  if (tabIndexAttribute === "-1") {
    return false;
  }

  if (
    element.disabled &&
    ELEMENTS_WITH_DISABLED_ATTRIBUTE.includes(element.localName)
  ) {
    return false;
  }

  // Either the attribute was set directly to '0' or it's an element that has tabIndex zero by default
  const hasTabIndexZero =
    tabIndexAttribute === "0" ||
    (element.tabIndex === 0 &&
      ELEMENTS_WITH_TABINDEX_ZERO_BY_DEFAULT.includes(element.localName));

  return (
    hasTabIndexZero &&
    isElementVisible(element) &&
    isParentCustomElementTabbable({ element, rootContainer })
  );
}

/**
 *
 * Returns tabbable elements filtered to remove any tooltips
 * @param {Array} elemsArray The element references array to filter of tooltip elements.
 * @returns {Array} Tabbable elements.
 */
export function filterTooltips(elemsArray) {
  // reference SLDS tooltip patterns && global focus in focusFirstElement
  // TODO discovery if there are common CSS classes for tooltips as Salesforce
  // https://www.lightningdesignsystem.com/accessibility/patterns/tooltip/
  const elemIsNotTooltip = (elem) => {
    if (!elem) {
      return false;
    }
    const elemRole = elem.getAttribute("role");
    return elemRole !== "tooltip";
  };
  return elemsArray && Array.isArray(elemsArray) && elemsArray.length > 0
    ? elemsArray.filter(elemIsNotTooltip)
    : [];
}

function isElementVisible(element) {
  const { width, height } = element.getBoundingClientRect();
  const nonZeroSize = width > 0 || height > 0;
  return nonZeroSize && getComputedStyle(element).visibility !== "hidden";
}

function isParentCustomElementTabbable({ element, rootContainer }) {
  const parentRoot = rootContainer.getRootNode();
  const ownerDocument = element.ownerDocument;
  let root = element.getRootNode();
  while (root !== parentRoot && root !== ownerDocument) {
    const host = root.host;
    if (host.getAttribute("tabindex") === "-1") {
      return false;
    }
    root = host && host.getRootNode();

    /* In LWC rootContainer might not be reachable due to shadow */
    if (!root) {
      return false;
    }
  }
  return true;
}

/* jsutil.js */

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export function deepCopy(obj) {
  if (Object(obj) !== obj) {
    return obj;
  }
  if (obj instanceof Set) {
    return new Set(obj);
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (typeof obj === "function") {
    return obj.bind({});
  }
  if (Array.isArray(obj)) {
    const obj2 = [];
    const len = obj.length;
    for (let i = 0; i < len; i++) {
      obj2.push(deepCopy(obj[i]));
    }
    return obj2;
  }
  const result = Object.create({});
  let keys = Object.keys(obj);
  if (obj instanceof Error) {
    keys = Object.getOwnPropertyNames(obj);
  }

  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    result[key] = deepCopy(obj[key]);
  }
  return result;
}

export function arraysEqual(array1, array2) {
  if (!array1 || !array2) {
    return false;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (let index = 0; index < array1.length; index++) {
    if (array1[index] instanceof Array && array2[index] instanceof Array) {
      if (!arraysEqual(array1[index], array2[index])) {
        return false;
      }
    } else if (array1[index] !== array2[index]) {
      return false;
    }
  }

  return true;
}

export function debounce(func, delay, options) {
  const _options = options || {};
  let invokeLeading = _options.leading;
  let timer;

  return function debounced() {
    const args = Array.prototype.slice.apply(arguments);
    if (invokeLeading) {
      func.apply(this, args);
      invokeLeading = false;
    }
    clearTimeout(timer);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timer = setTimeout(function () {
      func.apply(this, args);
      invokeLeading = _options.leading;
    }, delay);
  };
}

/* nextTick.js */

const inBrowser = typeof window !== "undefined";
const UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIE = UA && /msie|trident/.test(UA);
const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

function isNative(Ctor) {
  // any -> boolean
  return typeof Ctor === "function" && /native code/.test(Ctor.toString());
}

// eslint-disable-next-line no-unused-vars
function noop(a, b, c) {}

let isUsingMicroTask = false;

const callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
let timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
// istanbul ignore next, $flow-disable-line
if (typeof Promise !== "undefined" && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  // eslint-disable-next-line no-unused-vars
  isUsingMicroTask = true;
  // eslint-disable-next-line no-undef
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    // eslint-disable-next-line no-undef
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(flushCallbacks, 0);
  };
}

function handleError(e, ctx, funcName) {
  console.log("Error", e, ctx, funcName);
}

// eslint-disable-next-line consistent-return
export function nextTick(cb, ctx) {
  // ?function, ?object
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}

/* utilities.js */

export const uniqueId = (prefix) => {
  const prefixValue = prefix === undefined ? "sfGpsDs" : prefix;
  return `${prefixValue}-${Math.random().toString(36).substring(2, 18)}`;
};

export const isIPadPro = () => {
  // No god way to tell iPad Pro, this may will not work after years.
  // https://stackoverflow.com/a/58017456/1212791
  // TODO revisit
  if (
    navigator.userAgent.match(/Mac/) &&
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2
  ) {
    return true;
  }
  return false;
};
