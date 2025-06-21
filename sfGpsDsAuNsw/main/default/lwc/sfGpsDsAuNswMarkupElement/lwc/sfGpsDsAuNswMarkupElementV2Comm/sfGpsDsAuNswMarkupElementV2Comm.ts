/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";

export default 
class SfGpsDsAuNswMarkupElementV2Comm
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  markup?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  renderedCallback() {
    super.renderedCallback?.();

    const elt = this.refs.markup;

    if (this.markup && elt) {
      let tmpl = document.createElement("template");
      replaceInnerHtml(tmpl, this.markup);

      elt.parentNode?.replaceChild(tmpl.content, elt);
    }
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");

    if (this.className) {
      const classes = this.className.split(" ");
      this.classList.add(...classes);
    }
  }
}
