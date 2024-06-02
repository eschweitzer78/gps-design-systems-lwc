/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswButton extends LightningElement {
  static renderMode = "light";

  @api label;
  @api link;
  @api cstyle = "dark"; // oneOf(['dark', 'dark-outline', 'dark-outline-solid', 'light', 'light-outline','white','danger']
  @api type = "button";
  @api rendering = "button";
  @api iconStyle = "none"; // one of none, before, after
  @api iconName;
  @track ariaHaspopup;
  @api className;

  /* api: disabled */

  _disabledOriginal;
  _disabled;

  @api
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    this._disabledOriginal = value;
    this._disabled = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: mobileFullWidth */

  _mobileFullWidthOriginal;
  _mobileFullWidth;

  @api
  get mobileFullWidth() {
    return this._mobileFullWidthOriginal;
  }

  set mobileFullWidth(value) {
    this._mobileFullWidthOriginal = value;
    this._mobileFullWidth = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* deprecated */

  @api block;

  /* computed */

  get computedClassName() {
    return computeClass({
      "nsw-button": true,
      "nsw-button--dark": this.cstyle === "dark",
      "nsw-button--dark-outline": this.cstyle === "dark-outline",
      "nsw-button--dark-outline-solid": this.cstyle === "dark-outline-solid",
      "nsw-button--light": this.cstyle === "light",
      "nsw-button--light-outline": this.cstyle === "light-outline",
      "nsw-button--white": this.cstyle === "white",
      "nsw-button--danger": this.cstyle === "danger",
      "nsw-button--info": this.cstyle === "info",
      "nsw-button--full-width": this.mobileFullWidth,
      [this.className]: this.className
    });
  }

  get isAnchor() {
    return this.rendering === "a" || this.link;
  }

  get isButton() {
    return this.rendering === "button" && this.link == null;
  }

  get hasIconBefore() {
    return this.iconStyle === "before";
  }

  get hasIconAfter() {
    return this.iconStyle === "after";
  }

  get hasIcon() {
    return this.hasIconBefore || this.hasIconAfter;
  }

  handleClick() {
    const clickEvent = new CustomEvent("click");
    this.dispatchEvent(clickEvent);
  }

  renderedCallback() {
    const ariaHaspopup = this.getAttribute("aria-haspopup");

    if (ariaHaspopup) {
      this.ariaHaspopup = ariaHaspopup;
      this.removeAttribute("aria-haspopup");
    }
  }
}
