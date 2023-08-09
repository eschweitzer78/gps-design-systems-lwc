/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpersOs";

const ERROR_SR_LABEL = "Error: ";

let SfGpsUkGovLabelMixin = (base, defaultLabelSize = "medium") =>
  class extends base {
    @api labelSize = defaultLabelSize;

    get errorSrLabel() {
      return ERROR_SR_LABEL;
    }

    get computedLabelClassName() {
      return this.computeLabelClassName();
    }

    computeLabelClassName(className) {
      return computeClass({
        "govuk-label": true,
        [className]: className,
        "govuk-label--xl":
          this.labelSize === "xl" || this.labelSize === "x-large",
        "govuk-label--l": this.labelSize === "l" || this.labelSize === "large",
        "govuk-label--m": this.labelSize === "m" || this.labelSize === "medium",
        "govuk-label--s": this.labelSize === "s" || this.labelSize === "small"
      });
    }

    get computedMultiLabelClassName() {
      return this.computeMultiLabelClassName();
    }

    computeMultiLabelClassName(className) {
      return computeClass({
        "govuk-label": true,
        [className]: className
      });
    }

    get computedLegendClassName() {
      return computeClass({
        "govuk-fieldset__legend": true,
        "govuk-fieldset__legend--xl":
          this.labelSize === "xl" || this.labelSize === "x-large",
        "govuk-fieldset__legend--l":
          this.labelSize === "l" || this.labelSize === "large",
        "govuk-fieldset__legend--m":
          this.labelSize === "m" || this.labelSize === "medium",
        "govuk-fieldset__legend--s":
          this.labelSize === "s" || this.labelSize === "small"
      });
    }
  };

export default SfGpsUkGovLabelMixin;
