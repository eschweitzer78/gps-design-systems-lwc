/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswCallout extends LightningElement {
  static renderMode = "light";

  @api title;
  @api level = 4;
  @api firstChild;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-callout": true,
      [this.className]: this.className
    });
  }

  get computedTitleClassName() {
    return computeClass({
      "nsw-h1": this.level === 1,
      "nsw-h2": this.level === 2,
      "nsw-h3": this.level === 3,
      "nsw-h4": this.level === 4,
      "nsw-h5": this.level === 5,
      "nsw-h6": this.level >= 6
    });
  }
}
