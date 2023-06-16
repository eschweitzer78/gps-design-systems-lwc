/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsUkGovWarningText extends LightningElement {
  @api title;
  @api as;
  @api className;

  get computedClassName() {
    return computeClass({
      "govuk-warning-text": true,
      "govuk-warning-text--info": this.as === "info",
      "govuk-warning-text--error": this.as === "error",
      "govuk-warning-text--success": this.as === "success",
      [this.className]: this.className
    });
  }

  get computedIconText() {
    return computeClass({
      "!": this.as === "warning",
      i: this.as === "info",
      "⨉": this.as === "error",
      "✓": this.as === "success"
    });
  }

  get space() {
    return " ";
  }
}
