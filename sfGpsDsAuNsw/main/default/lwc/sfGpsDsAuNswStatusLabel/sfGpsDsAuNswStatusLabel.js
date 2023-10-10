/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswStatusLabels extends LightningElement {
  @api label;
  @api status;
  get computedClassName() {
    return computeClass({
      "nsw-status-label": true,
      "nsw-status-label--info": this.status === "info",
      "nsw-status-label--success": this.status === "success",
      "nsw-status-label--warning": this.status === "warning",
      "nsw-status-label--error": this.status === "error"
    });
  }
}
