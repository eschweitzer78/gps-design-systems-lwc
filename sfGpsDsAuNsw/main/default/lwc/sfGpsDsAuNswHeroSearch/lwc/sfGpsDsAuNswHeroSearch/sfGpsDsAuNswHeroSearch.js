/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api intro;
  @api links;
  @api value = ""; // ADJUSTED: added value public attribute
  @api className;

  @api srLabel = "Search site for:";
  @api srSearchButtonLabel = "Search";

  /* computed */

  get computedClassName() {
    return {
      "hero-search": true,
      [this.className]: this.className
    };
  }

  /* event management */

  handleChange(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = event.target.value;
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.dispatchEvent(new CustomEvent("search"));
    }

    return false; // avoid submission of form
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("search"));
  }
}
