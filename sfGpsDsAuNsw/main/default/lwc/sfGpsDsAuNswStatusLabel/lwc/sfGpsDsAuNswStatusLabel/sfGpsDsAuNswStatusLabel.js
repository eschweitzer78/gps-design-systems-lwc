/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const STATUS_DEFAULT = "info";
const STATUS_VALUES = {
  info: "nsw-status-label--info",
  success: "nsw-status-label--success",
  warning: "nsw-status-label--warning",
  error: "nsw-status-label--error"
};

export default class extends LightningElement {
  @api label;

  /* api: status, Picklist */

  _status = STATUS_VALUES[STATUS_DEFAULT];
  _statusOriginal = STATUS_DEFAULT;

  @api
  get status() {
    return this._statusOriginal;
  }

  set status(value) {
    this._statusOriginal = value;
    this._status =
      STATUS_VALUES[
        normaliseString(value, {
          fallbackValue: STATUS_DEFAULT,
          acceptedValues: STATUS_VALUES
        })
      ];
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-status-label": true,
      [this._status]: this._status
    };
  }
}
