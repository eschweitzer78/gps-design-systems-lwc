/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicButton extends LightningElement {
  static renderMode = "light";

  @api href;
  @api target;
  @api theme = "primary";
  @api disabled = false;

  get computedButtonClassName() {
    return computeClass({
      "rpl-button": true,
      "rpl-button--primary": this.theme === "primary",
      "rpl-button--secondary": this.theme === "secondary",
      "rpl-button--disabled": this.disabled
    });
  }
}
