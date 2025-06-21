/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  AdaptedNavigationMenuItem 
} from "c/sfGpsDsNavigation";
import type {
  UpperFooterMap 
} from "c/sfGpsDsAuNswUpperFooter"

export default 
class SfGpsDsAuNswUpperFooter 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  className?: string;

  /* api: items */

  _items?: AdaptedNavigationMenuItem[];
  _itemsOriginal?: AdaptedNavigationMenuItem[];

  // @ts-ignore
  @api
  get items(): AdaptedNavigationMenuItem[] | undefined {
    return this._itemsOriginal;
  }

  set items(items: AdaptedNavigationMenuItem[]) {
    this._itemsOriginal = items;
    this.itemsMapping();
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-footer__upper": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedHasItems(): boolean {
    return !!this._items?.length;
  }

  /* methods */

  _mapItems?: UpperFooterMap;

  itemsMapping() {
    let map: UpperFooterMap = {};
    this._items = this._itemsOriginal
      ? this.mapItems("item", 0, map, this._itemsOriginal)
      : undefined;
    this._mapItems = map;
  }

  mapItems(
    parentIndex: string, 
    parentLevel: number, map: 
    UpperFooterMap, 
    items: AdaptedNavigationMenuItem[]
  ): AdaptedNavigationMenuItem[] {
    let index = 0;

    return items.map((item) => {
      let result: AdaptedNavigationMenuItem = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        //level: parentLevel + 1,
        subNav: []
      };

      if (item.subNav) {
        result.subNav = this.mapItems(
          result.index as string,
          parentLevel + 1,
          map,
          item.subNav
        );
      }

      map[result.index as string] = result;
      return result;
    });
  }

  /* event management */

  handleClick(
    event: MouseEvent
  ): void {
    const target = event.currentTarget as HTMLElement;
    
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("navclick", {
        detail: target.dataset.ndx
      })
    );
  }
}
