/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const parser = new DOMParser();

export function replaceInnerHtml(element, markup) {
  // eslint-disable-next-line @lwc/lwc/no-inner-html
  element.innerHTML = markup;
}

export function htmlDecode(markup) {
  let htmlDoc = parser.parseFromString(markup, "text/html");
  let rn = htmlDoc.querySelector("body");

  return rn.childNodes.length === 0 ? "" : rn.childNodes[0].nodeValue;
}

export function getFirstChild(markup) {
  return parser.parseFromString(markup, "text/html").body.firstElementChild;
}
