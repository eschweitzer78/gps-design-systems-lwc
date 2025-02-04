/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { normaliseBoolean, normaliseString } from "c/sfGpsDsHelpers";

const CSTYLE_VALUES = [
  "dark",
  "dark-outline",
  "dark-outline-solid",
  "light",
  "light-outline",
  "white",
  "danger",
  "info"
];
const CSTYLE_DEFAULT = "dark";

const ICONSTYLE_NONE = "none";
const ICONSTYLE_BEFORE = "before";
const ICONSTYLE_AFTER = "after";
const ICONSTYLE_VALUES = [ICONSTYLE_AFTER, ICONSTYLE_BEFORE, ICONSTYLE_NONE];
const ICONSTYLE_DEFAULT = ICONSTYLE_NONE;

const RENDERING_A = "a";
const RENDERING_BUTTON = "button";
const RENDERING_VALUES = [RENDERING_A, RENDERING_BUTTON];
const RENDERING_DEFAULT = RENDERING_BUTTON;

const DISABLED_DEFAULT = false;
const MOBILEFULLWIDTH_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api label;
  @api link;
  @api type = "button";
  @api iconName;
  @api className;

  @track ariaHaspopup;

  /* api: cstyle */

  _cstyle = CSTYLE_DEFAULT;
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT
    });
  }

  /* api: iconStyle */

  _iconStyle = ICONSTYLE_DEFAULT;
  _iconStyleOriginal = ICONSTYLE_DEFAULT;

  @api
  get iconStyle() {
    return this._iconStyle;
  }

  set iconStyle(value) {
    this._iconStyleOriginal = value;
    this._iconStyle = normaliseString(value, {
      validValues: ICONSTYLE_VALUES,
      fallbackValue: ICONSTYLE_DEFAULT
    });
  }

  /* api: rendering */

  _rendering = RENDERING_DEFAULT;
  _renderingOriginal = RENDERING_DEFAULT;

  @api
  get rendering() {
    return this._renderingOriginal;
  }

  set rendering(value) {
    this._renderingOriginal = value;
    this._rendering = normaliseString(value, {
      validValues: RENDERING_VALUES,
      fallbackValue: RENDERING_DEFAULT
    });
  }

  /* api: disabled */

  _disabled = DISABLED_DEFAULT;
  _disabledOriginal = DISABLED_DEFAULT;

  @api
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    this._disabledOriginal = value;
    this._disabled = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISABLED_DEFAULT
    });
  }

  /* api: mobileFullWidth */

  _mobileFullWidth = MOBILEFULLWIDTH_DEFAULT;
  _mobileFullWidthOriginal = MOBILEFULLWIDTH_DEFAULT;

  @api
  get mobileFullWidth() {
    return this._mobileFullWidthOriginal;
  }

  set mobileFullWidth(value) {
    this._mobileFullWidthOriginal = value;
    this._mobileFullWidth = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: MOBILEFULLWIDTH_DEFAULT
    });
  }

  /* deprecated */

  @api block;

  /* computed */

  get computedClassName() {
    const rv = {
      "nsw-button": true,
      [`nsw-button--${this._cstyle}`]: this._cstyle,
      "nsw-button--full-width": this._mobileFullWidth,
      [this.className]: this.className
    };
    return rv;
  }

  get computedIsAnchor() {
    return this._rendering === RENDERING_A || this.link;
  }

  get computedHasIconBefore() {
    return this._iconStyle === ICONSTYLE_BEFORE;
  }

  get computedHasIconAfter() {
    return this._iconStyle === ICONSTYLE_AFTER;
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const clickEvent = new CustomEvent("click");
    this.dispatchEvent(clickEvent);
  }

  /* lifecycle */
  renderedCallback() {
    const ariaHaspopup = this.getAttribute("aria-haspopup");

    if (ariaHaspopup) {
      this.ariaHaspopup = ariaHaspopup;
      this.removeAttribute("aria-haspopup");
    }
  }
}
