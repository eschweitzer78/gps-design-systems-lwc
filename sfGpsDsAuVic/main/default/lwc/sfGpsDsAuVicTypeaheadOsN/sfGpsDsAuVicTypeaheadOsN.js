/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTypeahead from "c/sfGpsDsOmniTypeaheadOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicTypeaheadOsN.html";

export default class SfGpsDsAuVicTypeaheadOsN extends OmnistudioTypeahead {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this.sfGpsDsIsError,
      valid: !this.sfGpsDsIsError,
      required: this.required
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedComboboxClassName() {
    return computeClass({
      "sfgpsds-combobox": true,
      "sfgpsds-dropdown-trigger": true,
      "sfgpsds-dropdown-trigger_click": true,
      "sfgpsds-is-open": this.isLookupVisible
    });
  }
}
