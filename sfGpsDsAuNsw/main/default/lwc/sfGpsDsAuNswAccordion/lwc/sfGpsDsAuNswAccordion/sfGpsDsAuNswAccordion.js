/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from "lwc";
import { uniqueId, computeClass } from "c/sfGpsDsHelpers";

const ISOPEN_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api header;
  @api index;
  @api className;

  /* api: closed */

  @track _isOpen = ISOPEN_DEFAULT;

  @api
  get closed() {
    return !this._isOpen;
  }

  set closed(value) {
    this._isOpen = !value;
  }

  /* getters */

  get computedClassName() {
    return {
      "nsw-accordion__title": true,
      "nsw-accordion__open": this._isOpen,
      [this.className]: this.className
    };
  }

  get computedButtonClassName() {
    return {
      "nsw-accordion__button": true,
      active: this._isOpen
    };
  }

  get computedIsHidden() {
    return computeClass({
      hidden: !this._isOpen
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
    this.dispatchEvent(new CustomEvent(this._isOpen ? "collapse" : "expand"));
    this._isOpen = !this._isOpen;
  }
}
