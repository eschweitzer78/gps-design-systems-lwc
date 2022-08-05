/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsTimePickerOsN from "c/sfGpsDsTimePickerOsN";
import tmpl from "./sfGpsDsAuNswSTimePickerOsN.html";

export default class SfGpsDsAuNswSTimePickerOsN extends SfGpsDsTimePickerOsN {
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormItemClassName() {
    return "form__item"; // + " " + this.errorClass;
  }

  get computedLabelClassName() {
    return this.required && !this.hideAsterisk ? "form-required" : "";
  }

  get computedInputInputClassName() {
    return `form__input timeinput ${this.isError ? "error" : ""}`;
  }
}
