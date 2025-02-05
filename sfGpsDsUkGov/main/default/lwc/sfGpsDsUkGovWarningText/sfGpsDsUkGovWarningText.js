/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const ICONTEXT_VALUES = {
  warning: { iconText: "!", className: "" },
  info: { iconText: "i", className: "govuk-warning-text--info" },
  error: { iconText: "⨉", className: "govuk-warning-text--error" },
  success: { iconText: "✓", className: "govuk-warning-text--success" }
};
const ICONTEXT_DEFAULT = "warning";

export default class extends LightningElement {
  @api title;
  @api className;

  /* api: as */

  _as = ICONTEXT_VALUES[ICONTEXT_DEFAULT];
  _asOriginal = ICONTEXT_DEFAULT;

  @api
  get as() {
    return this._asOriginal;
  }

  set as(value) {
    this._asOriginal = value;
    this._as = normaliseString(value, {
      validValues: ICONTEXT_VALUES,
      fallbackValue: ICONTEXT_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "govuk-warning-text": true,
      [this._as.className]: this._as,
      [this.className]: this.className
    };
  }

  get computedIconText() {
    return this._as.iconText;
  }

  get space() {
    return " ";
  }
}
