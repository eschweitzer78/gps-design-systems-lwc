/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "c/sfGpsDsOmniDatetimePicker";
import tmpl from "./sfGpsDsAuVic2DatetimePicker.html";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends OmnistudioDatetimePicker {
  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  /* validation */

  @api setCustomValidation(message) {
    super.setCustomValidation(message);
    this.dateEl.setCustomValidation(message);
  }

  @api sfGpsDsClearCustomValidation() {
    super.sfGpsDsClearCustomValidation();
    this.dateEl.sfGpsDsClearCustomValidation();
  }
}
