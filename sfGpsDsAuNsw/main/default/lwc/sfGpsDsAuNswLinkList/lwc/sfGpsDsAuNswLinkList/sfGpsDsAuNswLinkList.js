/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswLinkList extends LightningElement {
  static renderMode = "light";

  @api title;
  @api links;
  @api firstChild;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-link-list": true,
      [this.className]: this.className
    });
  }
}
