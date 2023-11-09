/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "c/sfGpsDsOmniDatetimePickerOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import tmpl from "./sfGpsDsUkGovDatetimePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const ZWSP_CHAR = "​"; // this is the zero width space character, great for forcing a div/span to display with some height.
export default class SfGpsDsUkGovDatetimePickerOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioDatetimePicker
) {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.sfGpsDsIsError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp
    });
  }

  @api setCustomValidation(message) {
    this.dateEl.setCustomValidation(message);
    this.timeEl.setCustomValidation(ZWSP_CHAR); // zwsp - zero width space
  }

  @api sfGpsDsClearCustomValidation() {
    this.dateEl.sfGpsDsClearCustomValidation();
    this.timeEl.sfGpsDsClearCustomValidation();
  }
}
