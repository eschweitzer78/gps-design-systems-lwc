/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { isArray } from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import demoCollection from "./demoCollection";

export default class extends NavigationMixin(SfGpsDsIpLwc) {
  @api className;

  /* api: mode, Array of Object */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      this._items = this.mapIpData(demoCollection);
    }
  }

  /* api: navigationDevName, String */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName, String */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON, String */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* computed */

  get _isEmpty() {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  /* methods */

  mapIpData(data) {
    if (!data) {
      return null;
    }

    if (!isArray(data)) {
      data = [data];
    }

    return data.map((item, index) => ({
      ...item,
      index: item.index || `item-${index + 1}`,
      text: item.text || item.label,
      url: item.url || item.actionValue
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
