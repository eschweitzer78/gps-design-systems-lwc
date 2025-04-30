/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTimePicker from "c/sfGpsDsOmniTimePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSTimePickerOsN.html";

export default class extends OmnistudioTimePicker {
  @api hideAsterisk = false;

  /* computed */

  get computedFormItemClassName() {
    return "form__item";
  }

  get computedLabelClassName() {
    return {
      "form-required": this.required && !this.hideAsterisk
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedInputClassName() {
    return {
      form__input: true,
      timeinput: true,
      error: this.sfGpsDsIsError
    };
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
      "aria-activedescendant": this._isOpen ? this.aria_activedescendant : null
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
