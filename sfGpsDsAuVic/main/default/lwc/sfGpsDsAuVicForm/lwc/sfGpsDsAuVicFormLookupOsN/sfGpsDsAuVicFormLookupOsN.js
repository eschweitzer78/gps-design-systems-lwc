/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormLookupOsN from "c/sfGpsDsFormLookupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicFormLookupOsN.html";

export default class extends SfGpsDsFormLookupOsN {
  get computedFormGroupClassName() {
    return {
      "form-group": true,
      invalid: this.sfGpsDsIsError,
      valid: !this.sfGpsDsIsError,
      required: this._propSetMap.required
    };
  }

  get computedAriaInvalid() {
    return this.sfGpsDsIsError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this._handleHelpText,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
