/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const TYPE_VALUES = {
  default: "",
  "row-flush": "rpl-grid--no-row-gap"
};
const TYPE_DEFAULT = "default";

import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

/**
 * @slot Column-1
 * @slot Column-2
 * @slot Column-3
 * @slot Column-4
 * @slot Column-5
 * @slot Column-6
 * @slot Column-7
 * @slot Column-8
 * @slot Column-9
 * @slot Column-10
 * @slot Column-11
 * @slot Column-12
 */
export default class extends LightningElement {
  @api col1ClassName;
  @api col2ClassName;
  @api col3ClassName;
  @api col4ClassName;
  @api col5ClassName;
  @api col6ClassName;
  @api col7ClassName;
  @api col8ClassName;
  @api col9ClassName;
  @api col10ClassName;
  @api col11ClassName;
  @api col12ClassName;
  @api className;

  /* api: type */

  _type = TYPE_VALUES[TYPE_DEFAULT];
  _typeOriginal = TYPE_DEFAULT;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-grid": true,
      [this._type]: this._type,
      [this.className]: this.className
    };
  }
}
