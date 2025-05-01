/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsMarkdownElement from "c/sfGpsDsMarkdownElement";
import { HtmlSanitizer } from "c/sfGpsDsHelpers";
import defaultPlugIns from "c/sfGpsDsAuVic2HtmlPlugIns";
import tmpl from "./sfGpsDsAuVic2MarkdownElementComm.html";

HtmlSanitizer.options.plugIns = defaultPlugIns;

export default class extends SfGpsDsMarkdownElement {
  static renderMode = "shadow";

  /* api: content */

  @api
  get content() {
    return super.content;
  }

  set content(markdown) {
    super.content = markdown;
  }

  /* api: className */

  @api
  get className() {
    return super.className;
  }

  set className(value) {
    super.className = value;
  }

  /* computed */

  get sanitizer() {
    return HtmlSanitizer;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.classList.add("vic2-scope");
  }
}
