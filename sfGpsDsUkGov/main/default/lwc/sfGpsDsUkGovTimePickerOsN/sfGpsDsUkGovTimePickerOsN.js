/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsTimePickerOsN from "c/sfGpsDsTimePickerOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTimePickerOsN.html";

const ERROR_ID_SELECTOR = "[data-sf-gps-uk-gov-error-input]";
const DEFAULT_LABEL_SIZE = "large";
const DEBUG = false;

export default class SfGpsDsUkGovTimePickerOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsTimePickerOsN,
  DEFAULT_LABEL_SIZE
) {
  //@api fieldLabel;
  @api hideFormGroup = false;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": !this.hideFormGroup,
      "govuk-form-group--error": this.isError && !this.hideFormGroup
    });
  }

  get computedInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-input--error": this.isError,
      "sfgpsds-input_faux": true,
      "sfgpsds-combobox__input": true
    });
  }

  get computedItemFormGroupClassName() {
    return computeClass({
      "govuk-form-group": !this.hideFormGroup
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
    this.inputEle = this.inputEle ? this.inputEle : this.inputElement;

    if (this.inputEle) {
      this.setElementAttribute(this.inputEle, {
        "aria-activedescendant": this.aria_activedescendant
      });
    }
  }

  get _safeOptions() {
    return this.options || [];
  }

  @api
  getErrorDetails() {
    let rv = null;

    let elt = this.template.querySelector(ERROR_ID_SELECTOR);

    if (elt == null) {
      if (DEBUG)
        console.log("sfGpsDsUkGovTimePicker: cannot find input element");
    }

    rv =
      elt && this.isError
        ? {
            id: elt.id,
            errorMessage: this._errorMessage
          }
        : null;

    return rv;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
