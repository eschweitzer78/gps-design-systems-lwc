/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from "lwc";
import { uniqueId, computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswAccordion extends LightningElement {
  static renderMode = "light";

  @api header;
  @api index;
  @api className;

  /* api: closed */

  @api get closed() {
    return !this.isOpen;
  }

  set closed(value) {
    this.isOpen = !value;
  }

  @track isOpen = false;

  /* getters */

  get computedClassName() {
    return computeClass({
      "nsw-accordion__title": true,
      "nsw-accordion__open": this.isOpen,
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

  _controlsId;

  get computedAriaControlsId() {
    if (this._controlsId === undefined) {
      this._controlsId = uniqueId("sf-gps-ds-au-nsw-accordion");
    }

    return this._controlsId;
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(new CustomEvent(this.isOpen ? "collapse" : "expand"));
    this.isOpen = !this.isOpen;
  }
}
