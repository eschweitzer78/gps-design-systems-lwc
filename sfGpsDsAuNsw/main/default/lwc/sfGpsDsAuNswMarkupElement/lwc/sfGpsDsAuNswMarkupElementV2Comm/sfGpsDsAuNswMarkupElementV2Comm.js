/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api markup;
  @api className;

  renderedCallback() {
    let tmpl = document.createElement("template");
    replaceInnerHtml(tmpl, this.markup);
    const elt = this.refs.markup;
    elt.parentNode.replaceChild(tmpl.content, elt);
  }

  connectedCallback() {
    this.classList.add("nsw-scope");
    if (this.className) {
      const classes = this.className.split(" ");
      this.classList.add(...classes);
    }
  }
}
