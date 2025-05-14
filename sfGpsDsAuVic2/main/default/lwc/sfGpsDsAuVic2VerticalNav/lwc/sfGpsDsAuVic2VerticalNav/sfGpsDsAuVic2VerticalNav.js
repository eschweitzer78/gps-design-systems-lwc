import { LightningElement, api } from "lwc";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsAuVic2ExpandableStateMixin";

const PREVENTDEFAULT_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2VerticalNav";

export default class extends ExpandableStateMixin(LightningElement) {
  @api title;
  @api className;

  /* api: preventDefault */

  _preventDefaultOriginal = PREVENTDEFAULT_DEFAULT;
  _preventDefault = PREVENTDEFAULT_DEFAULT;

  @api
  get preventDefault() {
    return this._preventDefaultOriginal;
  }

  set preventDefault(value) {
    this._preventDefaultOriginal = value;
    this._preventDefault = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PREVENTDEFAULT_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return {
      "rpl-vertical-nav": true,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    };
  }

  /* methods */

  mapItem(item, index, length, active) {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> mapItem",
        JSON.stringify(item),
        index,
        length,
        active
      );

    /* override ExpandableState */

    const baseItem = super.mapItem(item, index, length, active);

    let rv = {
      ...baseItem,
      id: baseItem.id || `root-${index + 1}`,
      fullId: this.toggleId(item.id),
      active: active,
      ariaHidden: active ? null : true,
      className: computeClass({
        "rpl-vertical-nav__list-item": true,
        "rpl-vertical-nav__list-item--expanded": active
      }),
      items:
        baseItem.items && baseItem.items.length === 0 ? null : baseItem.items
    };

    if (DEBUG) console.debug(CLASS_NAME, "< mapItem", JSON.stringify(rv));

    return rv;
  }

  /*
  _itemMap;

  addToMap(itemList) {
    for (let index = 0; index < itemList.length; index++) {
      const item = itemList[index];
      this._itemMap.set(item.id, item);

      if (item.items?.length) {
        this.addToMap(item.items);
      }
    }
  }
    */

  toggleId(itemId) {
    return `rpl-vertical-nav-${itemId}-toggle`;
  }

  /* overrides */
  /*
  @api 
  get items() {
    return super.items;
  }

  set items(value) {
    super.items = value;

    this._itemMap = new Map();
    this.addToMap(this._items);
  }
  */

  /* event management */

  handleToggleMenuItem(event) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleToggleMenuItem",
        JSON.stringify(event.detail)
      );
    }

    this.dispatchEvent(
      new CustomEvent("togglemenuitem", {
        detail: event.detail
      })
    );
  }

  handleItemClick(event) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleItemClick",
        JSON.stringify(event.detail)
      );
    }

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: event.detail?.id,
        composed: true,
        bubbles: true
      })
    );
  }
}
