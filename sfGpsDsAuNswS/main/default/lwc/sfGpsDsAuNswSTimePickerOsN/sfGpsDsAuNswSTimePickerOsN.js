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
      errorMessageBlock: this.isError,
      helper: this.fieldLevelHelp
    });
  }

  get computedInputInputClassName() {
    return computeClass({
      form__input: true,
      timeinput: true,
      error: this.isError
    });
  }

  /* override parent as it does not set describedBy for field level help */

  synchronizeA11y() {
    this.aria_describedBy = this.computedAriaDescribedBy;
    super.synchronizeA11y();
  }
}
