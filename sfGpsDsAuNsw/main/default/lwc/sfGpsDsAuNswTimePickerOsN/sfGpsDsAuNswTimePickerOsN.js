/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTimePicker from "c/sfGpsDsOmniTimePickerOsN";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswTimePickerOsN.html";

export default class SfGpsDsAuNswTimePickerOsN extends StatusHelperMixin(
  OmnistudioTimePicker
) {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this.required && !this.hideAsterisk
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedFormGroupClass() {
    return computeClass({
      "nsw-form__group": !this.hideFormGroup
    });
  }

  /* we're doing it mostly via template */

  synchronizeA11y() {
    this.inputEle = this.inputEle
      ? this.inputEle
      : this.template.querySelector("input");
    if (!this.inputEle) {
      return;
    }

    this.setElementAttribute(this.inputEle, {
      "aria-activedescendant": this.aria_activedescendant
    });
  }
}
