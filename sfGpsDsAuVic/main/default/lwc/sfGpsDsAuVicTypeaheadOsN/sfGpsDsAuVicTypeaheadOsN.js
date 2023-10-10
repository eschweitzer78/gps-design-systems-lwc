/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTypeahead from "omnistudio/typeahead";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicTypeaheadOsN.html";

export default class SfGpsDsAuVicTypeaheadOs extends OmnistudioTypeahead {
  /* TODO: handle
    messageWhenValueMissing
    messageWhenTooLong
    messageWhenTooShort
  */

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: !this.validity?.valid,
      valid: this.validity?.valid,
      required: this.required
    });
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }
}
