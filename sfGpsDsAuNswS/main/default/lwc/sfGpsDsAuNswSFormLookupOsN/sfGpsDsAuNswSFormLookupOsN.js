/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormLookupOsN from "c/sfGpsDsFormLookupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSFormLookupOsN.html";

export default class SfGpsDsAuNswSFormLookupOsN extends SfGpsDsFormLookupOsN {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      form__required: this._propSetMap.required
    });
  }

  get computedInputClassName() {
    return computeClass({
      form__input: true,
      "sfgpsds-input": true,
      "sfgpsds-combobox__input": true,
      lookup: true,
      error: this.sfGpsDsIsError
    });
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
}
