/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTimePicker from "c/sfGpsDsOmniTimePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovTimePickerOsN.html";

const ZWSP_CHAR = "​";

export default class extends OmnistudioTimePicker {
  @api forceError;
  @api hideAsterisk;

  /* computed */

  get computedFormGroupClassName() {
    return {
      "fr-input-group": !this.hideFormGroup,
      "fr-input-group--error": !this.hideFormGroup && this.sfGpsDsIsError,
      "fr-input-group--disabled": !this.hideFormGroup && this.readOnly
    };
  }

  get computedInputClassName() {
    return {
      "fr-input": true,
      "fr-input--error": this.sfGpsDsIsError
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedInputId() {
    return "time-input";
  }

  get computedShowErrorMessageBlock() {
    return this.sfGpsDsIsError || this.forceError;
  }

  get _errorMessage() {
    return this.sfGpsDsErrorMessage?.replace("Error:", "") || ZWSP_CHAR;
  }

  /* methods */
  /* we're doing it mostly via template */

  synchronizeA11y() {
    this.inputEle = this.inputEle ? this.inputEle : this.inputElement;

    if (this.inputEle) {
      this.setElementAttribute(this.inputEle, {
        "aria-activedescendant": this.aria_activedescendant
      });
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
