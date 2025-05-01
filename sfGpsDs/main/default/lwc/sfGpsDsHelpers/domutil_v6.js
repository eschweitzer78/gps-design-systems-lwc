/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
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
  try {
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    element.innerHTML = markup;
  } catch (error) {
    console.log(
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

export function computeClass(config, joinChar = " ") {
  let result = Object.keys(config)
    .filter((key) => config[key])
    .join(joinChar);
  return result ? result : null;
}

export function isRTL() {
  return document.dir === "rtl";
}

export function getCssPropertyValue(propertyName) {
  const style = getComputedStyle(document.body);
  return style?.getPropertyValue(propertyName);
}

// JavaScript HTML Sanitizer v2.0.2, (c) Alexander Yumashev, Jitbit Software.
// homepage https://github.com/jitbit/HtmlSanitizer
// License: MIT https://github.com/jitbit/HtmlSanitizer/blob/master/LICENSE
// Modified by E Schweitzer to allow for configurable plug ins performing additional work

const HtmlSanitizer = new (function (
  _options = {
    allowData: true,
    allowAria: true
  }
) {
  // which tags are allowed
  const _tagWhitelist = {
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

  const _contentTagWhiteList = {
    FORM: true,
    "GOOGLE-SHEETS-HTML-ORIGIN": true
  }; //tags that will be converted to DIVs

  // which attributes are allowed
  const _attributeWhitelist = {
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
  const _cssWhitelist = {
    "background-color": true,
    color: true,
    "font-size": true,
    "font-weight": true,
    "text-align": true,
    "text-decoration": true,
    width: true
  };

  // which "protocols" are allowed in "href", "src" etc
  const _schemaWhiteList = [
    "http:",
    "https:",
    "data:",
    "m-files:",
    "file:",
    "ftp:",
    "mailto:",
    "pw:"
  ];

  const _uriAttributes = { href: true, action: true };
  const _parser = new DOMParser();

  this.sanitize = function (input, plugIns) {
    if (_options?.plugIns) {
      plugIns = [...(plugIns || []), ..._options.plugIns];
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

    let doc = _parser.parseFromString(input, "text/html");

    // DOM clobbering check (damn you firefox)
    if (doc.body.tagName !== "BODY") doc.body.remove();
    if (typeof doc.createElement !== "function") doc.createElement.remove();

    function makeSanitizedCopy(node) {
      let newNode;

      if (node.nodeType === Node.TEXT_NODE) {
        newNode = node.cloneNode(true);
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        (_tagWhitelist[node.tagName] || _contentTagWhiteList[node.tagName])
      ) {
        // is tag allowed?
        newNode = doc.createElement(
          _contentTagWhiteList[node.tagName] ? "DIV" : node.tagName
        );

        /* copy legitimate attributes */
        for (let i = 0; i < node.attributes.length; i++) {
          let attr = node.attributes[i];

          if (
            (_options?.allowAria && attr.name.startsWith("aria-")) ||
            (_options?.allowData && attr.name.startsWith("data-")) ||
            _attributeWhitelist[attr.name]
          ) {
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

        const childNodes = [...node.childNodes];
        for (let i = 0; i < childNodes.length; i++) {
          let subCopy = makeSanitizedCopy(childNodes[i]);
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

        /* any plugin? */
        for (let i = 0; i < (plugIns || []).length; i++) {
          if (newNode.matches(plugIns[i].selector)) {
            // found a pattern
            const plugInNode = plugIns[i].process(node, _parser);
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
  this.options = _options;
})();

export { HtmlSanitizer };
