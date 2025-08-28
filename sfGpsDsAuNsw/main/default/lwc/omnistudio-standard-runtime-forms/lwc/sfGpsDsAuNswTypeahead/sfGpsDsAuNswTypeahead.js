/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTypeahead from "c/sfGpsDsOmniTypeahead";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuNswTypeahead.html";

const I18N = {
  noResultFound: "-- No result found --"
};

export default class extends StatusHelperMixin(OmnistudioTypeahead) {
  /* computed */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedComboboxClassName() {
    return {
      "sfgpsds-combobox": true,
      "sfgpsds-dropdown-trigger": true,
      "sfgpsds-dropdown-trigger_click": true,
      "sfgpsds-is-open": this.isLookupVisible
    };
  }

  get computedDisabledOrReadOnly() {
    return this.disabled || this.readOnly;
  }

  get i18n() {
    return I18N || {};
  }

  get sfGpsDsInternalData() {
    const rv = super.sfGpsDsInternalData;

    for (let i = 0; i < rv.length; i++) {
      const item = rv[i];
      const valueSafeLc = (this._value || "").toLowerCase();
      const safeName = item.name || "";
      const searchTermLength = valueSafeLc.length;
      const indexOfSearchTerm = safeName.toLowerCase().indexOf(valueSafeLc);

      item.href = `#option-${item.itrKey}`;

      if (indexOfSearchTerm >= 0) {
        item.preSpan = safeName.substring(0, indexOfSearchTerm);
        item.span = safeName.substring(
          indexOfSearchTerm,
          indexOfSearchTerm + searchTermLength
        );
        item.postSpan = safeName.substring(
          indexOfSearchTerm + searchTermLength
        );
      } else {
        item.preSpan = safeName;
      }
    }

    return rv;
  }

  /* event management */

  selectOption(event, selectedItemIndex, selectedItemName) {
    if (event) {
      event.preventDefault(); // prevents following the href
    }

    super.selectOption(event, selectedItemIndex, selectedItemName);
  }

  handleClearOption() {
    this.sfGpsDsClearCustomValidation(false);
    this.showLookup(false);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
