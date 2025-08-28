/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "c/sfGpsDsOmniInputOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovInputOsN.html";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsUkGovInputOsN";

export default class extends SfGpsDsUkGovLabelMixin(OmniscriptInput) {
  @api labelClassName;

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

  /* api: prefix and suffix */

  @api sfGpsDsPrefix;
  @api sfGpsDsSuffix;

  /* Getters */
  /* ------- */

  get computedFormGroupClassName() {
    return {
      "govuk-form-group": !this._hideFormGroup,
      "govuk-form-group--error": !this._hideFormGroup && this.sfGpsDsIsError
    };
  }

  get computedInputClassName() {
    /**
     * vlocity-input used to be this.isCheckbox || this.isRadio || this.isToggle || this.isFile || this.isInput
     * but setting it it only matters for nds theme
     **/

    return {
      "govuk-checkboxes__input": this.isCheckbox || this.isToggle,
      "govuk-radios__item": this.isRadio,
      "govuk-file-upload": this.isFile,
      "govuk-input": this.isInput || this._isFormula,
      "govuk-input--error":
        (this.isInput || this._isFormula) && this.sfGpsDsIsError,
      "vlocity-input": false
    };
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

  get computedHasPrefixOrSuffix() {
    return this.sfGpsDsPrefix || this.sfGpsDsSuffix;
  }

  /* Methods */
  /* ------- */

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-uk-gov-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-uk-gov-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-uk-gov-datetime-picker-os-n";
        break;

      default:
    }

    if (DEBUG) console.log(CLASS_NAME, "initOptions", this._innerElement);
  }

  /* original maskedInput widget does a JS update of aria-describedby when validating
     and calls resolveAriaDescribedBy to do so. */

  resolveAriaDescribedBy() {
    return [
      this.template.querySelector(".govuk-hint")?.id,
      this.template.querySelector(".govuk-error-message")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
