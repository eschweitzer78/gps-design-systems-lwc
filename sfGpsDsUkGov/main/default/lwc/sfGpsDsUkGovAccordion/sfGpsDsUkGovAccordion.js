/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

const LABELID_PREFIX = "sf-gps-ds-uk-gov-accordion-title";
const DEFAULT_CLOSE_STATE = true;

const I18N = {
  showAllSectionsLabel: "Show all sections",
  hideAllSectionsLabel: "Hide all sections"
};
export default class SfGpsDsUkGovAccordion extends LightningElement {
  static renderMode = "light";

  @api className;

  /* api: accordions */

  _originalAccordions;
  @track _accordions;
  _numberOpen;

  @api get accordions() {
    return this._originalAccordions;
  }

  set accordions(value) {
    let numberOpen = 0;
    this._originalAccordions = value;
    this._accordions =
      this._originalAccordions && Array.isArray(this._originalAccordions)
        ? this._originalAccordions.map((item, index) => {
            let closed =
              item.closed === undefined ? DEFAULT_CLOSE_STATE : item.closed;
            numberOpen += closed ? 0 : 1;

            return {
              ...item,
              index: index + 1,
              key: `item-${index + 1}`,
              closed: closed
            };
          })
        : [];

    this._numberOpen = numberOpen;
  }

  /* computed: computedTitleId */

  _titleId;

  get computedTitleId() {
    if (this._titleId === undefined) {
      this._titleId = uniqueId(LABELID_PREFIX);
    }

    return this._titleId;
  }

  /* computed: computedClassName */

  get computedClassName() {
    return computeClass({
      "govuk-accordion": true,
      [this.className]: this.className
    });
  }

  /* i18n */

  get i18n() {
    return I18N;
  }

  /* event management */

  handleExpand(event) {
    let index = event.target.index - 1;
    this._accordions[index].closed = false;
    this._numberOpen++;
    this.dispatchEvent(new CustomEvent("expand", { detail: index }));
  }

  handleCollapse(event) {
    let index = event.target.index - 1;
    this._accordions[index].closed = true;
    this._numberOpen--;
    this.dispatchEvent(new CustomEvent("collapse", { detail: index }));
  }

  handleExpandAll() {
    this._numberOpen = this._accordions.length;
    this._accordions = this._accordions.map((item) => ({
      ...item,
      closed: false
    }));

    this.dispatchEvent(new CustomEvent("expandall"));
  }

  handleCollapseAll() {
    this._numberOpen = 0;
    this._accordions = this._accordions.map((item) => ({
      ...item,
      closed: true
    }));

    this.dispatchEvent(new CustomEvent("collapseall"));
  }

  /* computed: isFullyExpanded */

  get isFullyExpanded() {
    return this._numberOpen && this._numberOpen === this._accordions?.length;
  }

  /* computed: isFullyCollapsed */

  get isFullyCollapsed() {
    return this._numberOpen === 0;
  }
}
