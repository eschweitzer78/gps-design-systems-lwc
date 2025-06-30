/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  isArray 
} from "c/sfGpsDsHelpers";
import { 
  LightningElement,
  api, 
  track 
} from "lwc";

import type { 
  ExpandableState 
} from "c/sfGpsDsExpandableStateMixin";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsExpandableState";

const DEFAULT_ACTIVE_STATE = false;

export default 
function ExpandableStateMixin<T extends LightningElement>(
  base: new (...args: any[]) => LightningElement,
  idAttr = "id", 
  activeAttr = "active", 
  indexAttr = "index"
):
  new (...args: any[]) => ExpandableState & T
{
  if (DEBUG) console.debug(CLASS_NAME, "creator");

  class ExpandableState extends base {
    
    /* api: items */

    // @ts-ignore
    @track _items: any[] = [];
    _itemsOriginal: any[] = [];
    _nbActiveItems = 0;

    // @ts-ignore
    @api
    get items() {
      if (DEBUG) {
        console.debug(
          CLASS_NAME, "> get items"
        );
      }

      const rv = this._itemsOriginal;

      if (DEBUG) {
        console.debug(
          CLASS_NAME, "< get items", 
          JSON.stringify(rv)
        );
      }

      return rv;
    }

    set items(items) {
      if (DEBUG) {
        console.debug(
          CLASS_NAME, "> set items", 
          JSON.stringify(items)
        );
      }

      let nbActiveItems = 0;
      this._itemsOriginal = items;
      this._items =
        items && isArray(items)
          ? items.map((item, index) => {
              let active = item[activeAttr] || DEFAULT_ACTIVE_STATE;
              if (active) nbActiveItems++;
              return this.mapItem(item, index, items.length, active);
            })
          : [];

      this._nbActiveItems = nbActiveItems;

      if (DEBUG) {
        console.debug(
          CLASS_NAME, "< set items", 
          JSON.stringify(this._items)
        );
      }
    }

    /* methods */

    mapItem(
      item: any, 
      index: number, 
      length: number, 
      active: boolean
    ): any {
      if (DEBUG) console.debug(CLASS_NAME, "> mapItems", JSON.stringify(item), length);

      const rv = {
        ...item,
        [indexAttr]: item.index || index,
        [activeAttr]: active
      };

      if (DEBUG) console.debug(CLASS_NAME, "< mapItems", JSON.stringify(rv));
      return rv;
    }

    getItemById(
      id: string
    ): any {
      if (DEBUG) console.debug(CLASS_NAME, "> getItemsById", id);
      const rv = this._items.find((item) => item[idAttr] === id);
      if (DEBUG) console.debug(CLASS_NAME, "< getItemsById", JSON.stringify(rv));
      return rv;
    }

    isItemExpanded(
      item: any
    ): boolean {
      if (DEBUG) console.debug(CLASS_NAME, "> isItemExpanded", JSON.stringify(item));
      const rv = item[activeAttr];
      if (DEBUG) console.debug(CLASS_NAME, "< isItemExpanded", rv);
      return rv;
    }

    isItemExpandedById(
      id: string
    ): boolean {
      if (DEBUG) console.debug(CLASS_NAME, "> isItemExpandedById", id);
      const rv = this._items.some(
        (item) => item[idAttr] === id && item[activeAttr]
      );
      if (DEBUG) console.debug(CLASS_NAME, "< isItemExpandedById", rv);
      return rv;
    }

    isItemExpandedByIndex(
      index: number
    ): boolean {
      if (DEBUG) console.debug(CLASS_NAME, "> isItemExpandedByIndex", index);
      const item = this._items[index];
      const rv = item ? item[activeAttr] : null;
      if (DEBUG) console.debug(CLASS_NAME, "< isItemExpandedByIndex", rv);
      return rv;
    }

    isAllExpanded(): boolean {
      if (DEBUG) console.debug(CLASS_NAME, "> isAllExpanded");
      const rv = this._nbActiveItems === this._items.length;
      if (DEBUG) console.debug(CLASS_NAME, "< isAllExpanded", rv);
      return rv;
    }

    isAllCollapsed(): boolean {
      if (DEBUG) console.debug(CLASS_NAME, "> isAllCollapsed");
      const rv = this._nbActiveItems === 0;
      if (DEBUG) console.debug(CLASS_NAME, "< isAllCollapsed", rv);
      return rv;
    }

    toggleItem(
      item: any
    ): boolean | null {
      if (DEBUG) console.debug(CLASS_NAME, "> toggleItem", JSON.stringify(item));
      let wasActive: boolean | null = null;

      if (item) {
        wasActive = item[activeAttr];
        let mappedItem = this.mapItem(
          item,
          item[indexAttr],
          this._items.length,
          !wasActive
        );

        Object.assign(item, mappedItem);

        this._nbActiveItems += wasActive ? -1 : 1;
      }

      const rv = wasActive == null ? null : !wasActive;
      if (DEBUG) console.debug(CLASS_NAME, "< toggleItem", rv);
      return rv;
    }

    toggleItemById(id: string) {
      if (DEBUG) console.debug(CLASS_NAME, "> toggleItemById", id);
      const rv = this.toggleItem(this._items.find((item) => item[idAttr] === id));
      if (DEBUG) console.debug(CLASS_NAME, "< toggleItemById", rv);
      return rv;
    }

    toggleItemByIndex(index: number) {
      if (DEBUG) console.debug(CLASS_NAME, "> toggleItemByIndex", index);
      const rv = this.toggleItem(this._items[index]);
      if (DEBUG) console.debug(CLASS_NAME, "< toggleItemByIndex", rv);
      return rv;
    }

    toggleAll() {
      if (DEBUG) console.debug(CLASS_NAME, "> toggleAll");
      const isAllExpanded = this.isAllExpanded();
      const length = this._items.length;

      this._items = this._items.map((item, index) =>
        this.mapItem(item, index, length, !isAllExpanded)
      );
      this._nbActiveItems = isAllExpanded ? 0 : this._items.length;

      if (DEBUG) console.debug(CLASS_NAME, "< toggleAll", !isAllExpanded);
      return !isAllExpanded;
    }
  }

  // @ts-ignore
  return ExpandableState;
}