/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsDatePickerOsN from "c/sfGpsDsDatePickerOsN";
import tmpl from "./sfGpsDsAuVicDatePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuVicDatePickerOsN extends SfGpsDsDatePickerOsN {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": !this.hideFormGroup,
      invalid: this.isError,
      valid: !this.isError,
      required: this.required
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      errorMessageBlock: this.isError,
      helper: this.fieldLevelHelp
    });
  }
}
