/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import {
  normaliseString,
  normaliseBoolean,
  isRTL,
  uniqueId,
  isArray
} from "c/sfGpsDsHelpers";

const LABELID_PREFIX = "sf-gps-ds-au-vic-accordion-title";
const DEFAULT_CLOSE_STATE = true;

const TYPE_DEFAULT = "default";
const TYPE_NUMBERED = "numbered";
const TYPE_VALUES = [TYPE_DEFAULT, TYPE_NUMBERED];

const ACCORDIONS_DEFAULT = [];
const SHOWBUTTONS_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api className;

  /* api: type */

  _type = TYPE_DEFAULT;
  _typeOriginal = TYPE_DEFAULT;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    });
  }

  /* api: showButtons */

  _showButtons = SHOWBUTTONS_DEFAULT;
  _showButtonsOriginal = SHOWBUTTONS_DEFAULT;

  @api
  get showButtons() {
    return this._showButtonsOriginal;
  }

  set showButtons(value) {
    this._showButtonsOriginal = value;
    this._showButtons = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWBUTTONS_DEFAULT
    });
  }

  /* api: accordions */

  @track _accordions = ACCORDIONS_DEFAULT;
  _accordionsOriginal = ACCORDIONS_DEFAULT;
  _numberOpen;

  @api
  get accordions() {
    return this._accordionsOriginal;
  }

  set accordions(value) {
    let numberOpen = 0;
    this._accordionsOriginal = value;
    this._accordions = isArray(value)
      ? value.map((item, index) => {
          const closed =
            item.closed === undefined ? DEFAULT_CLOSE_STATE : item.closed;
          numberOpen += closed ? 0 : 1;

          return {
            ...item,
            index: index + 1,
            key: `item-${index + 1}`,
            closed
          };
        })
      : ACCORDIONS_DEFAULT;

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

  /* computed */

  get computedClassName() {
    return {
      "rpl-accordion": true,
      "rpl-accordion--rtl": isRTL(),
      [this.className]: this.className
    };
  }

  get computedIsNumbered() {
    return this._type === TYPE_NUMBERED;
  }

  get computedShowButtons() {
    return this._showButtons && this._accordions?.length;
  }

  get computedIsFullyExpanded() {
    return this._numberOpen && this._numberOpen === this._accordions?.length;
  }

  get computedIsFullyCollapsed() {
    return this._numberOpen === 0;
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
}
