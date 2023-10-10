/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";

/* IMPORTANT NOTE: this class is not automatically derived from sfGpsDsLwcOs */

export default class SfGpsDsLwcOsN extends OmniscriptBaseMixin(
  LightningElement
) {
  @track _sfGpsErrors;

  addError(code, description) {
    let errors = this._sfGpsErrors ? this._sfGpsErrors : [];
    this._sfGpsErrors = [
      ...errors,
      {
        index: errors.length,
        code: code,
        description: description
      }
    ];
  }

  clearErrors() {
    this._sfGpsErrors = null;
  }

  // For testing purposes only

  @api getErrors() {
    return this._sfGpsErrors;
  }

  /* lifecycle */

  _isConnected = false;

  connectedCallback() {
    this._isConnected = true;
  }

  disconnectedCallback() {
    this._isConnected = false;
  }
}

SfGpsDsLwcOsN.PACKAGE_NAME = "omnistudio";
