/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsTimePickerOsN from "c/sfGpsDsTimePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicTimePickerOsN.html";

export default class SfGpsDsAuVicTimePickerOsN extends SfGpsDsTimePickerOsN {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": !this.hideFormGroup,
      valid: !this.isError,
      invalid: this.isError,
      required: this.required && !this.hideAsterisk
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  /* we're doing it mostly via template */

  synchronizeA11y() {
    console.log("> synchronizeA11y");

    this.inputEle = this.inputEle ? this.inputEle : this.inputElement;

    if (this.inputEle) {
      this.setElementAttribute(this.inputEle, {
        "aria-activedescendant": this.aria_activedescendant
      });
    }

    console.log("< synchronizeA11y");
  }

  get _safeOptions() {
    return this.options || [];
  }
}
