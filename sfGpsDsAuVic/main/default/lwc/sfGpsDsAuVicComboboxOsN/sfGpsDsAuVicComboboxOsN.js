/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "omnistudio/combobox";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicComboboxOsN.html";

export default class SfGpsDsAuVicComboboxOsN extends OmnistudioCombobox {
  @api labelClassName;
  @api formGroupAddlClassName;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      valid: !this.isError,
      invalid: this.isError,
      required: this.required,
      [this.formGroupAddlClassName]: this.formGroupAddlClassName
    });
  }

  get computedRplSelectClassName() {
    return computeClass({
      "rpl-select": true,
      "rpl-select--open": this.isOpen,
      "rpl-select--disabled": this.disabled
    });
  }

  get ariaLabelledBy() {
    return computeClass({
      "rpl-select-label": !this.isLabelHidden
    });
  }

  get ariaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  /* setAriaAttributes in original combobox is implemented in a very strange way
   * with -is-selected always set for all entries... definitely not what it's supposed
   * to be in the slds...; redressing this
   */

  setAriaAttributes(e) {
    const t = this.template.querySelectorAll(`.${this.theme}-listbox__option`);

    for (let i = 0; i < t.length; i++) {
      let item = t[i];

      item.classList.remove(`${this.theme}-has-focus`);

      if (this.valueMap.includes(this.internalOptionsCopy[i].value)) {
        item.classList.add(`${this.theme}-is-selected`);
        item.setAttribute("aria-selected", "true");
      } else {
        item.classList.remove(`${this.theme}-is-selected`);
        item.setAttribute("aria-selected", "false");
      }

      if (i === e) {
        item.classList.add(`${this.theme}-has-focus`);

        this.activeDescendant = this.internalOptionsCopy[e].optId;
        if (item.scrollIntoView) {
          item.scrollIntoView({
            block: "nearest"
          });
        }
      }
    }
  }
}
