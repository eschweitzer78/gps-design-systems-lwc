/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTimePicker from "c/sfGpsDsOmniTimePickerOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTimePickerOsN.html";

const ZWSP_CHAR = "​";

export default class SfGpsDsUkGovTimePickerOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioTimePicker
) {
  @api forceError = false;
  @api hideFormGroup = false;

  /* obsolote */
  @api fieldLabel;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": !this.hideFormGroup,
      "govuk-form-group--error": this.sfGpsDsIsError && !this.hideFormGroup
    });
  }

  get computedInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-input--error": this.sfGpsDsIsError,
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
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedShowErrorMessageBlock() {
    return this.sfGpsDsIsError || this.forceError;
  }

  get computedErrorMessageBlockId() {
    return "errorMessageBlock";
  }

  get computedErrorMessage() {
    return this.sfGpsDsErrorMessage || ZWSP_CHAR;
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
}
