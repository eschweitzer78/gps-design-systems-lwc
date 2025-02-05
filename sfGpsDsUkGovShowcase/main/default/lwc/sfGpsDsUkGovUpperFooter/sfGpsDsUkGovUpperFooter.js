/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api className;

  /* api: items */

  _itemsOriginal;
  _items;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(items) {
    this._itemsOriginal = items;
    this.itemsMapping();
  }

  get computedClassName() {
    return {
      "govuk-footer__navigation": true,
      [this.className]: this.className
    };
  }

  get computedSectionClassName() {
    const nColumns = this._items?.length;

    return {
      "govuk-footer__section": true,
      "govuk-grid-column-one-quarter": nColumns === 4,
      "govuk-grid-column-one-third": nColumns === 3,
      "govuk-grid-column-one-half": nColumns === 2,
      "govuk-grid-column-full": nColumns === 1
    };
  }

  /* methods */

  _mapItems;

  itemsMapping() {
    let map = {};
    this._items = this._itemsOriginal
      ? this.mapItems("item", 0, map, this._itemsOriginal)
      : null;
    this._mapItems = map;
  }

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

  /* event management */

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent("click", {
        detail: event.currentTarget.dataset.ndx
      })
    );
  }
}
