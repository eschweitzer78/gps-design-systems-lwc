/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class sfGpsDsAuNswMarkupElementComm extends LightningElement {
  @api markup;
  @api className;

  renderedCallback() {
    replaceInnerHtml(this.refs.markup, this.markup || "");
  }

  connectedCallback() {
    this.classList.add("nsw-scope");
  }
}
