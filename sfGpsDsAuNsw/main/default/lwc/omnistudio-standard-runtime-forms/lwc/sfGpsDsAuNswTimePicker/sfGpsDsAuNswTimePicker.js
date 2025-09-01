/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTimePicker from "c/sfGpsDsOmniTimePicker";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuNswTimePicker.html";

export default class extends StatusHelperMixin(OmnistudioTimePicker) {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  /* computed */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required && !this.hideAsterisk
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedFormGroupClassName() {
    return {
      "nsw-form__group": !this.hideFormGroup
    };
  }

  get computedDisabledOrReadOnly() {
    return this.disabled || this.readOnly;
  }

  /* methods */
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

  /* lifecycle */

  render() {
    return tmpl;
  }
}
