/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.10
 */

import { LightningElement, api, track } from "lwc";
import {
  normaliseBoolean,
  normaliseInteger,
  replaceInnerHtml
} from "c/sfGpsDsHelpers";

const ACTIVE_DEFAULT = false;

export default class extends LightningElement {
  @api headingLevel = 3;
  @api title;
  @api content; // markup content
  @api className;

  /* api: active */

  @track _active = ACTIVE_DEFAULT;
  _activeOriginal = ACTIVE_DEFAULT;

  @api
  get active() {
    return this._activeOriginal;
  }

  set active(value) {
    this._activeOriginal = value;
    this._active = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ACTIVE_DEFAULT
    });
  }

  /* api: index */

  _indexOriginal;
  _index;

  @api
  get index() {
    return this._indexOriginal;
  }

  set index(value) {
    this._indexOriginal = value;
    this._index = normaliseInteger(value);
  }

  /* getters */

  get indexP1() {
    return this._index + 1;
  }

  get computedClassName() {
    return {
      qld__accordion: true,
      [this.className]: this.className
    };
  }

  get computedButtonClassName() {
    return {
      qld__accordion__title: true,
      "qld__accordion--closed": !this.active,
      "qld__accordion--open": this.active
    };
  }

  get computedBodyClassName() {
    return {
      qld__accordion__body: true,
      "qld__accordion--closed": !this.active,
      "qld__accordion--open": this.active
    };
  }

  get computedButtonId() {
    return "button";
  }

  get computedIsH2() {
    return (this.headingLevel || 2) === 2 || this.headingLevel === "2";
  }

  get computedIsH3() {
    return (
      this.headingLevel === 3 ||
      this.headingLevel === "3" ||
      this.headingLevel == null
    );
  }

  get computedIsH4() {
    return this.headingLevel === 4 || this.headingLevel === "4";
  }

  get computedIsH5() {
    return this.headingLevel === 5 || this.headingLevel === "5";
  }

  get computedIsH6() {
    return this.headingLevel === 6 || this.headingLevel === "6";
  }

  /* event management */

  handleToggle() {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: {
          index: this._index,
          active: !this.active
        }
      })
    );
  }

  /* lifecycle */

  renderedCallback() {
    if (this.content && this.refs.wrapper) {
      replaceInnerHtml(this.refs.wrapper, this.content);
    }
  }
}
