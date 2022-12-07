/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatePicker from "omnistudio/datePicker";
import tmpl from "./sfGpsDsAuNswDatePickerOsN.html";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuNswTimePickerOsN extends OmnistudioDatePicker {
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

  get computedFormGroupClass() {
    return computeClass({
      "nsw-form__group": !this.hideFormGroup
    });
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }
}
