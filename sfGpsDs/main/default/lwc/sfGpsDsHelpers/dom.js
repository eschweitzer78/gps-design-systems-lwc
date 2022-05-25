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
