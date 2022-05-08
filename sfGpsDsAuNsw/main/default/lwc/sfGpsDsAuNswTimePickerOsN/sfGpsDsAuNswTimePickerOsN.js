/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTimePicker from "omnistudio/timePicker";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import tmpl from "./sfGpsDsAuNswTimePickerOsN.html";

export default class SfGpsDsAuNswTimePickerOsN extends OmnistudioTimePicker {
  @api hideFormGroup = false;

  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return `nsw-form__label ${this.required ? "nsw-form__required" : ""}`;
  }

  get computedFormGroupClass() {
    return this.hideFormGroup ? "" : "nsw-form__group";
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }
}
