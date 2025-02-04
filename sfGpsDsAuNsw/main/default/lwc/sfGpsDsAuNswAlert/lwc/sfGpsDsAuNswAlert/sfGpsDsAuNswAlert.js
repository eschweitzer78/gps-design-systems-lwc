/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { normaliseBoolean, normaliseString } from "c/sfGpsDsHelpers";

const AS_DEFAULT = "info";
const AS_VALUES = {
  info: { className: "nsw-in-page-alert--info", iconName: "info" },
  warning: { className: "nsw-in-page-alert--warning", iconName: "error" },
  error: { className: "nsw-in-page-alert--error", iconName: "cancel" },
  success: { className: "nsw-in-page-alert--success", iconName: "check_circle" }
};

const COMPACT_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api className;

  /* api: as */

  _as = AS_VALUES[AS_DEFAULT];
  _asOriginal = AS_DEFAULT;

  @api
  get as() {
    return this._asOriginal;
  }

  set as(value) {
    this._asOriginal = value;
    this._as = normaliseString(value, {
      validValues: AS_VALUES,
      defaultValue: AS_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: compact */

  _compact = COMPACT_DEFAULT;
  _compactOriginal = COMPACT_DEFAULT;

  @api
  get compact() {
    return this._compactOriginal;
  }

  set compact(value) {
    this._compactOriginal = value;
    this._compact = normaliseBoolean(value, {
      acceptString: true,
      defaultValue: COMPACT_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-in-page-alert": true,
      "nsw-in-page-alert--compact": this._compact,
      [this._as.className]: this._as.className,
      [this.className]: this.className
    };
  }

  get computedIconName() {
    return this._as.iconName;
  }

  get space() {
    return " ";
  }
}
