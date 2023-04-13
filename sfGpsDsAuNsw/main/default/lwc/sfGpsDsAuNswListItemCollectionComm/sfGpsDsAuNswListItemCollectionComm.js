/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class SfGpsDsAuNswListItemCollectionComm extends NavigationMixin(
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

  @api isBlock = false;
  @api isReversed = false;
  @api isRelative = false;
  @api showLink = false;
  @api dateStyle = "medium";
  @api className;

  mapIpData(data) {
    return data && Array.isArray(data)
      ? data.map((item, index) => ({
          ...item,
          headline:
            item.headline ||
            `[${item.title}](${this.isRelative ? this.communityBasePath : ""}${
              item.link
            })`,
          key: item.key || `item-${index + 1}`
        }))
      : null;
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
