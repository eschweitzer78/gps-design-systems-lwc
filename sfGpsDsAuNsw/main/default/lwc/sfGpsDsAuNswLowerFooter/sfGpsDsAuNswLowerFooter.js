/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswLowerFooter extends LightningElement {
  static renderMode = "light";

  @api items;
  @api statement;
  @api className;

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent("click", {
        detail: event.currentTarget.dataset.ndx
      })
    );
  }

  get computedClassName() {
    return computeClass({
      "nsw-footer__lower": true,
      [this.className]: this.className
    });
  }
}
