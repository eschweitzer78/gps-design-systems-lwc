/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "c/sfGpsDsOmniInputOsN";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovInputOsN.html";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsFrGovInputOsN";

export default class extends OmniscriptInput {
  @api labelClassName;
  @api readOnly;

  /* api hideFormGroup */

  _hideFormGroup = false;
  _hideFormGroupOriginal = false;

  @api
  get hideFormGroup() {
    return this._hideFormGroupOriginal;
  }

  set hideFormGroup(value) {
    this._hideFormGroupOriginal = value;

    this._hideFormGroup = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* Methods */
  /* ------- */

  render() {
    return tmpl;
  }

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-fr-gov-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-fr-gov-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-fr-gov-datetime-picker-os-n";
        break;

      default:
    }

    if (DEBUG) console.log(CLASS_NAME, "initOptions", this._innerElement);
  }

  /* Getters */
  /* ------- */

  get computedFormGroupClassName() {
    return computeClass({
      "fr-input-group": !this._hideFormGroup,
      "fr-input-group--error": !this._hideFormGroup && this.sfGpsDsIsError,
      "fr-input-group--disabled": this.readOnly
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "fr-label": true
    });
  }

  get computedInputClassName() {
    /**
     * vlocity-input used to be this.isCheckbox || this.isRadio || this.isToggle || this.isFile || this.isInput
     * but setting it it only matters for nds theme
     **/

    return computeClass({
      "fr-upload": this.isFile,
      "fr-input": this.isInput || this._isFormula,
      "fr-input--error":
        (this.isInput || this._isFormula) && this.sfGpsDsIsError,
      "fr-input--valid":
        (this.isInput || this._isFormula) && this.sfGpsDsIsValid,
      "vlocity-input": false
    });
  }

  get computedErrorMessageBlockId() {
    return "errorMessageBlock";
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get _errorMessage() {
    return this.sfGpsDsErrorMessage?.replace("Error:", "");
  }

  /* methods */

  resolveAriaDescribedBy() {
    /* original maskedInput widget does a JS update of aria-describedby when validating
      and calls resolveAriaDescribedBy to do so. */

    return [
      this.template.querySelector(".fr-hint-text")?.id,
      this.template.querySelector(".fr-input")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }
}
