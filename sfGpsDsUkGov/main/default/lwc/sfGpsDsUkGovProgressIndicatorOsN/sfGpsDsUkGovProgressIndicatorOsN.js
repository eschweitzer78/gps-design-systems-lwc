/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api step = 1;
  @api of = 1;
  @api className;

  get steps() {
    let arr = [];

    for (let i = 1; i <= this.of; i++) {
      arr.push({
        index: i,
        isActive: i === this.step,
        className: i === this.step ? "active" : ""
      });
    }

    return arr;
  }

  get computedClassName() {
    return {
      "govuk-ext-progress-indicator": true,
      [this.className]: this.className
    };
  }
}
