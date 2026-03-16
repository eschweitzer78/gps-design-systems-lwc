/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTypeahead from "c/sfGpsDsOmniTypeaheadOsN";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswTypeaheadOsN.html";

const CLASS_NAME = "SfGpsDsAuNswTypeaheadOsN";
const DEBUG = false;

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
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> selectOption",
        "target=",
        event.target,
        "currentTarget=",
        event.currentTarget
      );

    let transientEvent = event;

    if (event) {
      event.preventDefault(); // prevents following the href

      /* we need to massage the event as super.selectOption uses target.innerText */
      transientEvent = {
        ...event,
        target: event.currentTarget,
        currentTarget: event.currentTarget
      };

      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= selectOption",
          "target=",
          transientEvent.target,
          "currentTarget=",
          transientEvent.currentTarget
        );
    }

    super.selectOption(transientEvent, selectedItemIndex, selectedItemName);
    if (DEBUG) console.debug(CLASS_NAME, "< selectOption");
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
