/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuNswTagOsN extends LightningElement {
  @api complete = false;
  @api className;

  get isComplete() {
    let complete = this.complete ? this.complete.toString() : "false";
    return complete === "true";
  }

  get computedClassName() {
    let complete = this.complete ? this.complete.toString() : "false";

    return computeClass({
      "snsw-completion-tag": true,
      "snsw-completion-tag__complete": complete === "true",
      "snsw-completion-tag__incomplete": complete !== "true",
      [this.className]: this.className
    });
  }
}
