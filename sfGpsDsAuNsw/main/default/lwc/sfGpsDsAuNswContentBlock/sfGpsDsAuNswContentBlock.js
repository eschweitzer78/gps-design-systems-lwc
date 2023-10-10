/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswContentBlock extends LightningElement {
  static renderMode = "light";

  @api headline;
  @api image;
  @api imageAlt;
  @api icon;
  @api mainLink;
  @api links = [];
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-content-block": true,
      [this.className]: this.className
    });
  }
}
