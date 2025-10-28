/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "c/sfGpsDsOmniComboboxOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswComboboxOsN.html";

export default class extends SfGpsDsAuNswStatusHelperMixin(OmnistudioCombobox) {
  @api labelClassName;

  /* computed */

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required,
      [this.labelClassName]: this.labelClassName
    };
  }

  /* overrides */

  get internalOptionsCopy() {
    const rv = super.internalOptionsCopy;

    for (let i = 0; i < rv.length; i++) {
      const item = rv[i];
      rv[i].href = `#option-${item.optId}`;
      rv[i].isClear = item.value === "none" || item.value === "";
      // It should really be none but the original handleKeyDown has a bug/typo on ArrowUp when open that uses this.options when it should be this.internalOptions
      // This has a side effect of clearning none values. Overall all of that is not optimal as it means you cannot have a properly working combobox with an option
      // whose value is either "none" or the empty string.
    }

    return rv;
  }

  set internalOptionsCopy(value) {
    super.internalOptionsCopy = value;
  }

  /* event management */

  selectOption(event, selectedOption) {
    if (event) {
      event.preventDefault(); // prevents following the href
    }

    super.selectOption(event, selectedOption);
  }

  preventClickDefault(event) {
    event.preventDefault(); // prevents following the href
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
