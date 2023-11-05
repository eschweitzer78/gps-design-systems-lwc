/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTimePicker from "c/sfGpsDsOmniTimePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicTimePickerOsN.html";

export default class SfGpsDsAuVicTimePickerOsN extends OmnistudioTimePicker {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": !this.hideFormGroup,
      valid: !this.sfGpsDsIsError,
      invalid: this.sfGpsDsIsError,
      required: this.required && !this.hideAsterisk
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* we're doing it mostly via template */

  synchronizeA11y() {
    this.inputEle = this.inputEle
      ? this.inputEle
      : this.template.querySelector("input");

    if (this.inputEle) {
      this.setElementAttribute(this.inputEle, {
        "aria-activedescendant": this.aria_activedescendant
      });
    }
  }
}
