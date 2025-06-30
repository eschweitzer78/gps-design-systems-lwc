/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { isArray, isObject } from "./typeutil";

const parser = new DOMParser();

/**
 * Replaces the element innerHTML with a new markup provided as a string.
 *
 * @param {Element} element
 * @param {string} markup - markup to place as the element's innerHtml
 */

export function replaceInnerHtml(
  element: Element, 
  markup: string | undefined | null
): void {
  try {
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    element.innerHTML = markup || "";
  } catch (error) {
    console.error(
      "Error in replaceInnerHtml",
      element && element.toString ? element.toString() : "",
      JSON.stringify(element),
      error
    );
  }
}

/**
 * Decodes espaced html, e.g. what's store in Salesforce's CMS Rich Text fields into normal markup
 * for instance &lt;p;gt& to <p>.
 *
 * @param {string} markup escaped markup
 * @returns {string} unescaped markup
 */

export function htmlDecode(
  markup:  | undefined | null
): string | null {
  if (!markup) {
    return null;
  }

  const htmlDoc = parser.parseFromString(markup, "text/html");
  const rn = htmlDoc.querySelector("body");

  return rn?.childNodes.length === 0 ? "" : (rn as HTMLBodyElement).childNodes[0].nodeValue;
}

/**
 * Returns the first element child of a parsed markup's body, e.g. "<div>a</div><p>Hello</p>" returns
 * "<div>a</div>"
 *
 * @param {string} markup
 * @returns {Element} first element child node
 */

export function getFirstChild(
  markup: string | undefined | null
): Element | null {
  if (!markup) {
    return null;
  }

  const htmlDoc = parser.parseFromString(markup, "text/html");
  const rn = htmlDoc.querySelector("body");

  return rn ? rn.firstElementChild : null;
}

export function computeClass(
  config: Record<string, any> | string[], 
  joinChar: string = " "
): string | null {
  if (isObject(config)) {
    const result = Object.keys(config)
      .filter((key) => (config as {[key: string]: any})[key])
      .join(joinChar);
    return result || "";
  }

  return isArray(config) ? config.join(joinChar) : null
}

export function isRTL(): boolean {
  return document.dir === "rtl";
}

export function getCssPropertyValue(
  propertyName: string
): string | null {
  const style = getComputedStyle(document.body);
  return style?.getPropertyValue(propertyName);
}

// JavaScript HTML Sanitizer v2.0.2, (c) Alexander Yumashev, Jitbit Software.
// homepage https://github.com/jitbit/HtmlSanitizer
// License: MIT https://github.com/jitbit/HtmlSanitizer/blob/master/LICENSE
// Modified by E Schweitzer to allow for configurable plug ins performing additional work

import type { HtmlSanitizerPlugin } from "c/sfGpsDsHelpers";

const _uriAttributes: Record<string, boolean> = { 
  href: true, 
  action: true 
};

const _tagWhitelist: Record<string, boolean> = {
  A: true,
  ABBR: true,
  ADDRESS: true,
  ARTICLE: true,
  ASIDE: true,
  AUDIO: true,
  B: true,
  BLOCKQUOTE: true,
  BODY: true,
  BR: true,
  CAPTION: true,
  CENTER: true,
  CITE: true,
  CODE: true,
  COL: true,
  COLGROUP: true,
  DATA: true,
  DD: true,
  DEL: true,
  DETAILS: true,
  DIV: true,
  DL: true,
  DT: true,
  EM: true,
  FIGCAPTION: true,
  FIGURE: true,
  FOOTER: true,
  H1: true,
  H2: true,
  H3: true,
  H4: true,
  H5: true,
  H6: true,
  HEADER: true,
  HGROUP: true,
  HR: true,
  I: true,
  IMG: true,
  INS: true,
  LABEL: true,
  LEGEND: true,
  LI: true,
  MARK: true,
  MENU: true,
  NAV: true,
  OL: true,
  P: true,
  PICTURE: true,
  PRE: true,
  PROGRESS: true,
  Q: true,
  RP: true,
  RT: true,
  RUBY: true,
  S: true,
  SAMP: true,
  SECTION: true,
  SMALL: true,
  SOURCE: true,
  SPAN: true,
  STRONG: true,
  SUB: true,
  SUMMARY: true,
  SUP: true,
  TABLE: true,
  TBODY: true,
  TD: true,
  TFOOT: true,
  TH: true,
  THEAD: true,
  TIME: true,
  TITLE: true,
  TR: true,
  U: true,
  UL: true,
  VAR: true,
  VIDEO: true,
  WBR: true
};

const _contentTagWhiteList: Record<string, boolean> = {
  FORM: true,
  "GOOGLE-SHEETS-HTML-ORIGIN": true
}; //tags that will be converted to DIVs

// which attributes are allowed
const _attributeWhitelist: Record<string, boolean> = {
  align: true,
  allow: true,
  alt: true,
  autoplay: true,
  background: true,
  cite: true,
  class: true,
  color: true,
  colspan: true,
  controls: true,
  datetime: true,
  decoding: true,
  disabled: true,
  headers: true,
  height: true,
  href: true,
  hreflang: true,
  id: true,
  intrisicsize: true,
  lang: true,
  loading: true,
  loop: true,
  media: true,
  muted: true,
  playsinline: true,
  poster: true,
  preload: true,
  refererpolicy: true,
  rel: true,
  reversed: true,
  rowspan: true,
  sandbox: true,
  scope: true,
  sizes: true,
  span: true,
  src: true,
  srcdoc: true,
  srcset: true,
  start: true,
  style: true,
  summary: true,
  target: true,
  title: true,
  translate: true,
  usemap: true,
  type: true,
  width: true
};

// which bits are allowed in "style"
const _cssWhitelist: Record<string, boolean> = {
  "background-color": true,
  color: true,
  "font-size": true,
  "font-weight": true,
  "text-align": true,
  "text-decoration": true,
  width: true
};

// which "protocols" are allowed in "href", "src" etc
const _schemaWhiteList: string[] = [
  "http:",
  "https:",
  "data:",
  "m-files:",
  "file:",
  "ftp:",
  "mailto:",
  "pw:"
];

interface HtmlSanitizerOptions {
  allowData?: boolean,
  allowAria?: boolean,
  plugIns?: HtmlSanitizerPlugin[]
}

class HtmlSanitizerClass {
  _parser: DOMParser;
  AllowedTags: Record<string, boolean>;
  AllowedAttributes: Record<string, boolean>;
  AllowedCssStyles: Record<string, boolean>;
  AllowedSchemas: string[];
  options: HtmlSanitizerOptions;

  constructor(_options: HtmlSanitizerOptions = {
    allowData: true,
    allowAria: true
  }) {
    // which tags are allowed


    this._parser = new DOMParser();

    this.AllowedTags = _tagWhitelist;
    this.AllowedAttributes = _attributeWhitelist;
    this.AllowedCssStyles = _cssWhitelist;
    this.AllowedSchemas = _schemaWhiteList;
    this.options = _options;

  }

  sanitize(
    input: string, 
    plugIns: HtmlSanitizerPlugin[]
  ): string {
    if (this.options?.plugIns) {
      plugIns = [...(plugIns || []), ...this.options.plugIns];
    }

    input = input.trim();
    if (input === "" || input === "<br>") {
      // br: firefox "bogus node" workaround for wysiwyg's
      // to save performance
      return "";
    }

    if (input.indexOf("<body") === -1) {
      input = "<body>" + input + "</body>";
      //add "body" otherwise some tags are skipped, like <style>
    }

    let doc = this._parser.parseFromString(input, "text/html");

    // DOM clobbering check (damn you firefox)
    if (doc.body.tagName !== "BODY") doc.body.remove();
    /* @ts-ignore */
    if (typeof doc.createElement !== "function") doc.createElement.remove();


    const resultElement = this.makeSanitizedCopy(doc, doc.body, plugIns);

    // eslint-disable-next-line @lwc/lwc/no-inner-html
    return resultElement instanceof HTMLElement 
      ? resultElement.innerHTML
        .replace(/<br[^>]*>(\S)/g, "<br>\n$1")
        .replace(/div><div/g, "div>\n<div") //replace is just for cleaner code
      : ""; //resultElement;
  };

  startsWithAny(
    str: string, 
    substrings: string[]
  ): boolean {
    for (let i = 0; i < substrings.length; i++) {
      if (str.indexOf(substrings[i]) === 0) {
        return true;
      }
    }

    return false;
  }

  makeSanitizedCopy(
    doc: Document, 
    node: Node | Element, 
    plugIns: HtmlSanitizerPlugin[]
  ): Node {
    let newNode: Node | Element | HTMLElement;

    if (node.nodeType === Node.TEXT_NODE) {
      newNode = node.cloneNode(true);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      (
        this.AllowedTags[(node as Element).tagName] || 
        _contentTagWhiteList[(node as Element).tagName]
      )
    ) {
      const tagName = (node as Element).tagName;
      // is tag allowed?
      newNode = doc.createElement(
        _contentTagWhiteList[tagName] ? "DIV" : tagName
      );

      /* copy legitimate attributes */
      for (let i = 0; i < (node as Element).attributes.length; i++) {
        let attr = (node as Element).attributes[i];

        if (
          (this.options?.allowAria && attr.name.startsWith("aria-")) ||
          (this.options?.allowData && attr.name.startsWith("data-")) ||
          this.AllowedAttributes[attr.name]
        ) {
          if (attr.name === "style") {
            for (let s = 0; s < (node as HTMLElement).style.length; s++) {
              const styleName = (node as HTMLElement).style[s];
              if (this.AllowedCssStyles[styleName])
                (newNode as HTMLElement).style.setProperty(
                  styleName,
                  (node as HTMLElement).style.getPropertyValue(styleName)
                );
            }
          } else {
            if (_uriAttributes[attr.name]) {
              //if this is a "uri" attribute, that can have "javascript:" or something
              if (
                attr.value.indexOf(":") > -1 &&
                !this.startsWithAny(attr.value, _schemaWhiteList)
              )
                continue;
            }

            (newNode as Element).setAttribute(attr.name, attr.value);
          }
        }
      }

      const childNodes = [...node.childNodes];

      for (let i = 0; i < childNodes.length; i++) {
        let subCopy = this.makeSanitizedCopy(doc, childNodes[i], plugIns);
        newNode.appendChild(subCopy);
      }

      //remove useless empty spans (lots of those when pasting from MS Outlook)
      if (
        (tagName === "SPAN" ||
          tagName === "B" ||
          tagName === "I" ||
          tagName === "U"
        ) &&
        // eslint-disable-next-line @lwc/lwc/no-inner-html
        (newNode as HTMLElement).innerHTML.trim() === ""
      ) {
        return doc.createDocumentFragment();
      }

      /* any plugin? */
      for (let i = 0; i < (plugIns || []).length; i++) {
        if ((newNode as Element).matches(plugIns[i].selector)) {
          // found a pattern
          const plugInNode = plugIns[i].process(node, this._parser);
          if (plugInNode) {
            newNode = plugInNode;
            break;
          }
        }
      }
    } else {
      newNode = doc.createDocumentFragment();
    }

    return newNode;
  }
}
// @ts-ignore
const HtmlSanitizer = new HtmlSanitizerClass();

export { HtmlSanitizer };
