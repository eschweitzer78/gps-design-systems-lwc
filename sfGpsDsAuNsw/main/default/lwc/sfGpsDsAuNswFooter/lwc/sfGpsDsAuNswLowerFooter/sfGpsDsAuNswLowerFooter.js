/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api items;
  @api statement;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "nsw-footer__lower": true,
      [this.className]: this.className
    };
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent("navclick", {
        detail: event.currentTarget.dataset.ndx
      })
    );
  }
}
