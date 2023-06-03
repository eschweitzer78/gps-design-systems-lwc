/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class SfGpsDsAuNswLinkCollectionComm extends NavigationMixin(
  SfGpsDsIpLwc
) {
  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  @api className;

  mapIpData(data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    return data.map((item) => ({
      ...item,
      text: item.text,
      url: item.url
    }));
  }

  get isEmpty() {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
