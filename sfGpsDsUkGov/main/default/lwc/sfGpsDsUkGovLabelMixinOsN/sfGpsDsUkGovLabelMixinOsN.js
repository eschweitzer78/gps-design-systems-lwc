/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpersOs";

const ERROR_SR_LABEL = "Error: ";

let SfGpsUkGovLabelMixin = (base) =>
  class extends base {
    @api labelSize;

    /*
    get _labelSize() {
      // empty labelSize is a legitimate value, so test for null
      return this.labelSize == null ? defaultLabelSize : this.labelSize;
    }
    */

    get sfGpsDsErrorSrLabel() {
      return ERROR_SR_LABEL;
    }

    get computedLabelClassName() {
      return this.computeLabelClassName();
    }

    computeLabelClassName(className) {
      let ls = this.labelSize;

      return computeClass({
        "govuk-label": true,
        [className]: className,
        "govuk-label--xl":
          ls === "xl" || ls === "x-large" || (ls == null) & this.computedIsH1,
        "govuk-label--l":
          ls === "l" || ls === "large" || (ls == null) & this.computedIsH2,
        "govuk-label--m":
          ls === "m" || ls === "medium" || (ls == null) & this.computedIsH3,
        "govuk-label--s": ls === "s" || ls === "small"
      });
    }

    get computedLegendClassName() {
      let ls = this.labelSize;

      return computeClass({
        "govuk-fieldset__legend": true,
        "govuk-fieldset__legend--xl":
          ls === "xl" || ls === "x-large" || (ls == null) & this.computedIsH1,
        "govuk-fieldset__legend--l":
          ls === "l" || ls === "large" || (ls == null) & this.computedIsH2,
        "govuk-fieldset__legend--m":
          ls === "m" || ls === "medium" || (ls == null) & this.computedIsH3,
        "govuk-fieldset__legend--s": ls === "s" || ls === "small"
      });
    }

    @api isHeading;

    get computedIsH1() {
      return this.isHeading == null
        ? true
        : this.isHeading === true ||
            this.isHeading === 1 ||
            this.isHeading === "1";
    }

    get computedIsH2() {
      return this.isHeading === 2 || this.isHeading === "2";
    }

    get computedIsH3() {
      return this.isHeading === 3 || this.isHeading === "3";
    }
  };

export default SfGpsUkGovLabelMixin;
