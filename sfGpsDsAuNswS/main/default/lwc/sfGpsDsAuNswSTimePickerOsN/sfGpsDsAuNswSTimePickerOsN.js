/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsTimePickerOsN from "c/sfGpsDsTimePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSTimePickerOsN.html";

export default class SfGpsDsAuNswSTimePickerOsN extends SfGpsDsTimePickerOsN {
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormItemClassName() {
    return "form__item";
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required && !this.hideAsterisk
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  get computedInputInputClassName() {
    return computeClass({
      form__input: true,
      timeinput: true,
      error: this.isError
    });
  }

  get computedAriaControls() {
    return this._isOpen ? "time_picker_ul" : null;
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
      "aria-activedescendant": this._isOpen ? this.aria_activedescendant : null
    });
  }
}
