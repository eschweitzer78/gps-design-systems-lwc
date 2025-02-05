/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const DATE_STYLE_DEFAULT = "medium";

import { api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { isArray } from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class extends NavigationMixin(SfGpsDsIpLwc) {
  @api dateStyle = DATE_STYLE_DEFAULT;
  @api isRelative = false;
  @api isBlock = false;
  @api isReversed = false;
  @api showLink = false;
  @api className;

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
      headline:
        item.headline ||
        `[${item.title}](${this.isRelative ? this.communityBasePath : ""}${
          item.link
        })`,
      key: item.key || `item-${index + 1}`
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
