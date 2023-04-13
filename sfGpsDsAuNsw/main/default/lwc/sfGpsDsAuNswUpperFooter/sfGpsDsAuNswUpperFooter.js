/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswUpperFooter extends LightningElement {
  static renderMode = "light";

  @api className;

  /* api: items */

  _itemsOriginal;
  _mapItems;
  _items;

  mapItems(parentIndex, parentLevel, map, items) {
    let index = 0;

    return items.map((item) => {
      let result = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        level: parentLevel + 1,
        subNav: []
      };

      if (item.subNav) {
        result.subNav = this.mapItems(
          result.index,
          parentLevel + 1,
          map,
          item.subNav
        );
      }

      map[result.index] = result;
      return result;
    });
  }

  @api get items() {
    return this._itemsOriginal;
  }

  set items(items) {
    this._itemsOriginal = items;
    this.itemsMapping();
  }

  itemsMapping() {
    let map = {};
    this._items = this._itemsOriginal
      ? this.mapItems("item", 0, map, this._itemsOriginal)
      : null;
    this._mapItems = map;
  }

  handleClick(event) {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent("click", {
        detail: event.currentTarget.dataset.ndx
      })
    );
  }

  get computedClassName() {
    return computeClass({
      "nsw-footer__upper": true,
      [this.className]: this.className
    });
  }
}
