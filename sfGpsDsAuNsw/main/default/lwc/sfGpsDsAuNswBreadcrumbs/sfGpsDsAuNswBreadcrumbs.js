/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswBreadcrumbs extends LightningElement {
  static renderMode = "light";

  @api label = "breadcrumbs";
  @api containerClassName = "nsw-p-bottom-xs nsw-m-bottom-sm";
  @api className = "";
  @api items = [];

  get computedClassName() {
    return computeClass({
      "nsw-breadcrumbs": true,
      [this.className]: this.className
    });
  }
}
