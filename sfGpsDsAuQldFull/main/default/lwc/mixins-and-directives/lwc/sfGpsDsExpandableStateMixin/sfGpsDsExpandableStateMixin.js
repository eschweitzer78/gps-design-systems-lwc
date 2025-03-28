import { api, track } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

const DEFAULT_ACTIVE_STATE = false;

const ExpandableStateMixin = (Base, idAttr = "id", activeAttr = "active") =>
  class extends Base {
    /* api: items */

    _itemsOriginal = [];
    @track _items = [];
    _nbActiveItems = 0;

    @api
    get items() {
      return this._itemsOriginal;
    }

    set items(items) {
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
    }

    /* methods */

    mapItem(item, index, length, active) {
      return {
        ...item,
        index: item.index || index,
        [activeAttr]: active
      };
    }

    getItemById(id) {
      return this._items.find((item) => item[idAttr] === id);
    }

    isItemExpanded(id) {
      return this._items.some(
        (item) => item[idAttr] === id && item[activeAttr]
      );
    }

    isIndexExpanded(index) {
      const item = this._items[index];
      return item ? item[activeAttr] : null;
    }

    isAllExpanded() {
      return this._nbActiveItems === this._items.length;
    }

    isAllCollapsed() {
      return this._nbActiveItems === 0;
    }

    toggleItem(id) {
      let foundItem = this._items.find((item) => item[idAttr] === id);

      if (foundItem) {
        let wasActive = foundItem[activeAttr];
        let mappedItem = this.mapItem(
          foundItem,
          foundItem.index,
          this._items.length,
          !wasActive
        );

        Object.assign(foundItem, mappedItem);

        this._nbActiveItems += wasActive ? -1 : 1;

        return !wasActive;
      }

      return null;
    }

    toggleIndex(index) {
      let item = this._items[index];

      if (item) {
        let wasActive = item[activeAttr];
        this._items[index] = this.mapItem(
          item,
          index,
          this._items.length,
          !wasActive
        );
        this._nbActiveItems += wasActive ? -1 : 1;

        return !wasActive;
      }

      return null;
    }

    toggleAll() {
      const isAllExpanded = this.isAllExpanded();
      const length = this._items.length;

      this._items = this._items.map((item, index) =>
        this.mapItem(item, index, length, !isAllExpanded)
      );
      this._nbActiveItems = isAllExpanded ? 0 : this._items.length;

      return !isAllExpanded;
    }
  };

export default ExpandableStateMixin;
