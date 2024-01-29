/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "c/sfGpsDsOmniDatetimePickerOsN";
import tmpl from "./sfGpsDsFrGovDatetimePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const ZWSP_CHAR = "​"; // this is the zero width space character, great for forcing a div/span to display with some height.

export default class extends OmnistudioDatetimePicker {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "fr-input-group": true,
      "fr-input-group--error": this.sfGpsDsIsError,
      "fr-input-group--disabled": this.readOnly
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp
    });
  }

  /* override do we can clear the custom validation */

  @api setCustomValidation(message) {
    super.setCustomValidation(message);
    this.dateEl.setCustomValidation(message);
    this.timeEl.setCustomValidation(ZWSP_CHAR); // zwsp - zero width space
  }

  @api sfGpsDsClearCustomValidation() {
    super.sfGpsDsClearCustomValidation();
    this.dateEl.sfGpsDsClearCustomValidation();
    this.timeEl.sfGpsDsClearCustomValidation();
  }
}
