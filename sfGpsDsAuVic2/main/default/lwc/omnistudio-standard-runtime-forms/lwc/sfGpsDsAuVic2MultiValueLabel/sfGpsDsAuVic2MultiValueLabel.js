/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { nextTick } from "c/sfGpsDsHelpers";

const MORE_LABEL_WIDTH = 74;

export default class extends LightningElement {
  /* api: selectedOptions */

  _selectedOptions;

  @api
  get selectedOptions() {
    return this._selectedOptions;
  }

  set selectedOptions(value) {
    this._selectedOptions = (value || []).map((opt, index) => ({
      ...opt,
      charAt0: opt.label?.charAt(0),
      key: `option-${index + 1}`
    }));
    this.calculateNumberOfHiddenItems();
  }

  @track numItemsHidden = 0;
  @track optionsAreaWidth;

  /* getters */

  get selectedOptionValues() {
    return (this.selectedOptions || []).map((opt) => opt.value);
  }

  /* methods */

  async calculateNumberOfHiddenItems() {
    if (!this._observer) {
      /* never rendered */
      return;
    }

    const itemsRef = this.refs.itemsRef;
    await nextTick();

    const labelElements = [
      ...itemsRef.querySelectorAll('[data-option-label="true"]')
    ];

    const containerBBox = itemsRef.getBoundingClientRect();

    // Here we figure out how much space there is to fit the items in, it's
    // important to factor in the width of the '+# more' label here even
    // if it's not currently being rendered.
    const widthToFill =
      this.numItemsHidden === 0
        ? this.optionsAreaWidth - MORE_LABEL_WIDTH
        : this.optionsAreaWidth;

    // Count how many labels are at least partially visible
    let countShown = 0;

    for (const labelEl of labelElements) {
      const itemBBox = labelEl.getBoundingClientRect();

      const itemCharWidth =
        labelEl
          .querySelector(".rpl-form-dropdown__multi-value-label-char")
          ?.getBoundingClientRect()?.width || 0;

      if (itemBBox.left - containerBBox.left > widthToFill - itemCharWidth) {
        break;
      } else {
        countShown += 1;
      }
    }

    // Based on the above, figure out how many items are hidden
    this.numItemsHidden = this.selectedOptionValues.length - countShown;
  }

  /* lifecycle */

  _observer;

  renderedCallback() {
    if (!this._observer) {
      this._observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          this.optionsAreaWidth = cr.width;
        }
      });

      this._observer.observe(this.refs.itemsRef);
    }
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = null;
  }
}
