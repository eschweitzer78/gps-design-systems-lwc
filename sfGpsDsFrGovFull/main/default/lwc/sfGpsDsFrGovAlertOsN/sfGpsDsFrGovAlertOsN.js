/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const I18N = {
  maskMessage: "Masquer le mmessage"
};

export default class SfGpsDsFrGovFormMessagingOsN extends LightningElement {
  @api type;
  @api size;
  @api title;
  @api description;
  @api hasClosedButton;
  @api className;

  @track closed;

  /* computed */

  get isSmall() {
    return this.size === "sm";
  }

  get computedShowAlert() {
    return this.title || this.description || !this.closed;
  }

  get computedAlertClassName() {
    return computeClass({
      "fr-alert": true,
      "fr-alert--sm": this.size === "sm",
      "fr-alert--error": this.type === "error",
      "fr-alert--success": this.type === "success",
      "fr-alert--info": this.type === "info",
      "fr-alert--warning": this.type === "warning",
      [this.className]: this.className
    });
  }

  get space() {
    return " ";
  }

  get i18n() {
    return I18N;
  }

  /* event management */

  handleClick() {
    this.closed = true;
  }
}
