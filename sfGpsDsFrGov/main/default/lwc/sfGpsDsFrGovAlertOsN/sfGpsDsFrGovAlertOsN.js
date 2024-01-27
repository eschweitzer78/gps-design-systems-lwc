/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsFrGovFormMessagingOsN extends LightningElement {
  @api type;
  @api size;
  @api title;
  @api description;
  @api hasClosedButton;
  @api className;

  @track closed;

  get isSmall() {
    return this.size === "sm";
  }

  get computedShowAlert() {
    return this.title || this.description;
  }

  get computedAlertClassName() {
    return computeClass({
      "fr-alert": true,
      "fr-alert--sm": this.size === "sm",
      "fr-alert--error": this.type === "error",
      "fr-alert--success": this.type === "sucsess",
      "fr-alert--info": this.type === "info",
      "fr-alert--warning": this.type === "warning",
      [this.className]: this.className
    });
  }
}
