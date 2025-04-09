/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const BUTTON_ICON = "icon";
const BUTTON_TEXT = "text";
const BUTTON_VALUES = [BUTTON_ICON, BUTTON_TEXT];
const BUTTON_DEFAULT = BUTTON_ICON;
const SHOWLABEL_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api intro;
  @api links;
  @api value = ""; // ADJUSTED: added value public attribute
  @api className;

  @api searchLabel = "Search site for:";
  @api searchButtonLabel = "Search";

  /* api: button */

  _buttonOriginal = BUTTON_DEFAULT;
  _button = BUTTON_DEFAULT;

  @api
  get button() {
    return this._buttonOriginal;
  }

  set button(value) {
    this._buttonOriginal = value;
    this._button = normaliseString(value, {
      validValues: BUTTON_VALUES,
      fallbackValue: BUTTON_DEFAULT
    });
  }

  /* api: label */
  /* A slightly confusing of attribute name as we're looking at a yes/no to showing the label, 
     but we are sticking to Digital.NSW's choice */

  _labelOriginal = SHOWLABEL_DEFAULT;
  _label = SHOWLABEL_DEFAULT;

  @api
  get label() {
    return this._labelOriginal;
  }

  set label(value) {
    this._labelOriginal = value;
    this._label = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWLABEL_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "hero-search": true,
      [this.className]: this.className
    };
  }

  get computedLabelClassName() {
    return {
      "sr-only": !this.label,
      "nsw-form__label": true
    };
  }

  get computedInputGroupClassName() {
    return {
      "nsw-form__input-group": true,
      "nsw-form__input-group--icon": this.computedButtonIsIcon
    };
  }

  get computedHasTextButton() {
    return this._button === BUTTON_TEXT;
  }

  get computedHasIconButton() {
    return this._button === BUTTON_ICON;
  }

  /* event management */

  handleChange(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = event.target.value;
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.dispatchEvent(new CustomEvent("search"));
    }

    return false; // avoid submission of form
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("search"));
  }
}
