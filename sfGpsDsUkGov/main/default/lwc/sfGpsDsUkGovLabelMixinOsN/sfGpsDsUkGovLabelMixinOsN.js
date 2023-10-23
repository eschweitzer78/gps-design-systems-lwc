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

    get _labelSize() {
      // empty labelSize is a legitimate value, so test for null
      return this.labelSize == null ? defaultLabelSize : this.labelSize;
    }

    get errorSrLabel() {
      return ERROR_SR_LABEL;
    }

    get computedLabelClassName() {
      return this.computeLabelClassName();
    }

    computeLabelClassName(className) {
      let ls = this._labelSize;

      return computeClass({
        "govuk-label": true,
        [className]: className,
        "govuk-label--xl": ls === "xl" || ls === "x-large",
        "govuk-label--l": ls === "l" || ls === "large",
        "govuk-label--m": ls === "m" || ls === "medium",
        "govuk-label--s": ls === "s" || ls === "small"
      });
    }

    get computedLegendClassName() {
      let ls = this._labelSize;

      return computeClass({
        "govuk-fieldset__legend": true,
        "govuk-fieldset__legend--xl": ls === "xl" || ls === "x-large",
        "govuk-fieldset__legend--l": ls === "l" || ls === "large",
        "govuk-fieldset__legend--m": ls === "m" || ls === "medium",
        "govuk-fieldset__legend--s": ls === "s" || ls === "small"
      });
    }
  };

export default SfGpsUkGovLabelMixin;
