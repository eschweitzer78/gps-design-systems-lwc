/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const DATE_STYLE_DEFAULT = "medium";

import { 
  api 
} from "lwc";
import {
   NavigationMixin 
  } from "lightning/navigation";
import { 
  isArray 
} from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

import type { 
  ListItem 
} from "c/sfGpsDsAuNswListItemCollectionComm";

export default 
class SfGpsDsAuNswListItemCollectionComm 
extends NavigationMixin<SfGpsDsIpLwc>(SfGpsDsIpLwc) {
  // @ts-ignore
  @api 
  dateStyle = DATE_STYLE_DEFAULT;

  // @ts-ignore
  @api 
  isRelative = false;

  // @ts-ignore
  @api 
  isBlock = false;

  // @ts-ignore
  @api 
  isReversed = false;

  // @ts-ignore
  @api 
  showLink = false;

  // @ts-ignore
  @api 
  className?: string;

  /* api: ipName, String */

  // @ts-ignore
  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON, String */

  // @ts-ignore
  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  // @ts-ignore
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

  mapIpData(
    data: Partial<ListItem> | Array<Partial<ListItem>>
  ): any[] {
    if (!data) {
      return [];
    }

    if (!isArray(data)) {
      data = [data as Partial<ListItem>];
    }

    return (data as ListItem[]).map((item, index) => ({
      ...item,
      headline:
        item.headline ||
        `[${item.title}](${this.isRelative ? this.communityBasePath : ""}${
          item.link
        })`,
      key: `item-${index + 1}`
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
