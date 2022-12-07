/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswAccordion extends LightningElement {
  @api header;
  @api className;

  @api get closed() {
    return !this.isOpen;
  }

  set closed(value) {
    this.isOpen = !value;
  }

  @track isOpen = false;

  get computedClassName() {
    return computeClass({
      "nsw-accordion__title": true,
      [this.className]: this.className
    });
  }

  get computedButtonClassName() {
    return computeClass({
      "nsw-accordion__button": true,
      active: this.isOpen
    });
  }

  get computedIsHidden() {
    return computeClass({
      hidden: !this.isOpen
    });
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent(this.isOpen ? "collapse" : "expand"));
    this.isOpen = !this.isOpen;
  }
}
