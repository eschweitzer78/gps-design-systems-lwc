/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";

/* IMPORTANT NOTE: if you modify this class, you have to update sfGpsDsLwcOsN
   as it's not automatically derived */

export default class SfGpsDsLwc extends LightningElement {
  @track _sfGpsDsErrors;

  addError(code, description) {
    let errors = this._sfGpsDsErrors || [];
    this._sfGpsDsErrors = [
      ...errors,
      {
        index: errors.length,
        code: code,
        description: description
      }
    ];
  }

  clearErrors() {
    this._sfGpsDsErrors = null;
  }

  // For testing purposes only

  @api getErrors() {
    return this._sfGpsDsErrors;
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

SfGpsDsLwc.PACKAGE_NAME = "c";
