/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormLookupOsN from "c/sfGpsDsFormLookupOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswFormLookupOsN.html";

const I18N = {
  clearLabel: "-- Clear --"
};

export default class extends SfGpsDsAuNswStatusHelperMixin(
  SfGpsDsFormLookupOsN
) {
  /* computed */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this._propSetMap.required
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

  get computedOptions() {
    const rv = super.computedOptions;

    for (let i = 0; i < rv.length; i++) {
      const item = rv[i];
      if (item.value === "--") {
        item.isClear = true;
        item.value = I18N.clearLabel;
      }

      item.href = `#option-${item.id}`;
    }

    return rv;
  }

  /* event management */

  selectOption(event) {
    event.preventDefault(); // prevents following the href
    super.selectOption(event);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdsaunsw-read-only";
  }
}
