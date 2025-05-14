import { LightningElement, api } from "lwc";
import {
  normaliseBoolean,
  normaliseInteger,
  computeClass
} from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsAuVic2ExpandableStateMixin";

const ISEXPANDED_DEFAULT = false;
const PREVENTDEFAULT_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2VerticalNavList";

export default class extends ExpandableStateMixin(LightningElement) {
  @api className;

  /* api: level */

  _levelOriginal;
  _level;

  @api
  get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._level = normaliseInteger(value);
    this._levelOriginal = this._level;
    this._childLevel = this._level + 1;
  }

  /* api: toggleLevels */

  _toggleLevels;
  _toggleLevelsOriginal;

  @api
  get toggleLevels() {
    return this._toggleLevelsOriginal;
  }

  set toggleLevels(value) {
    this._toggleLevelsOriginal = value;
    this._toggleLevels = normaliseInteger(value);
  }

  /* api: isExpanded */

  _isExpandedOriginal = ISEXPANDED_DEFAULT;
  _tabindex;

  @api
  get isExpanded() {
    return this._isExpandedOriginal;
  }

  set isExpanded(value) {
    this._isExpandedOriginal = value;
    this._tabindex = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISEXPANDED_DEFAULT
    })
      ? "0"
      : "-1";
  }

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

  /* computed */

  get computedClassName() {
    return {
      "rpl-vertical-nav__list": true,
      [`rpl-vertical-nav__list--level-${this._level}`]: true,
      "rpl-type-p-small": true,
      [this.className]: this.className
    };
  }

  get computedIsExpandable() {
    return this._items?.length && this._level <= this._toggleLevels;
  }

  /*
  get decoratedItems() {
    return (this.items || []).map((item, index) => ({
      ...item,
      index: item.index || `item-${this._level}-${index + 1}`,
      isLinkActive: item?.active && !item.items?.some((i) => i.active)
    }));
  }
  */

  get decoratedItems() {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> get decoratedItems",
        JSON.stringify(this._items)
      );

    // Because the top level items with children aren't actually links, we need to ensure that
    // the first child of each top level item is a link to that page. These links
    // have the same label as the parent item.

    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname || "/";

    if (DEBUG)
      console.debug(CLASS_NAME, "= get decoratedItems", "pathname", pathname);

    const rv = (this._items || []).map((baseItem, index) => {
      const isCurrentPage = baseItem.url === pathname;

      return {
        ...baseItem,
        index: baseItem.index || `item-${this._level}-${index + 1}`,
        isLinkActive:
          baseItem?.active && !baseItem.items?.some((i) => i.active),
        items:
          baseItem.url && baseItem.items?.length
            ? [
                {
                  id: baseItem.id,
                  text: baseItem.text,
                  url: baseItem.url,
                  active: isCurrentPage
                },
                ...baseItem.items
              ]
            : baseItem.items
      };
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "<  get decoratedItems", JSON.stringify(rv));

    return rv;
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
      showChildIcon: this.showIcon(index),
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

  toggleId(itemId) {
    return `rpl-vertical-nav-${itemId}-toggle`;
  }

  showIcon(index) {
    const hasIcon = this._level > Math.max(this._toggleLevels, 2);

    return index === 0 && this._lebel - 1 <= this._toggleLevels
      ? false
      : hasIcon;
  }

  /* event management */

  handleToggle(event) {
    const itemId = event.target.dataset.itemId;
    const item = this.getItemById(itemId);

    if (DEBUG) {
      console.debug(CLASS_NAME, "handleToggle", JSON.stringify(item));
    }

    this.toggleItem(itemId);
    this.dispatchEvent(
      new CustomEvent("togglemenuitem", {
        detail: {
          id: itemId,
          action: this.isItemExpanded(itemId) ? "open" : "close",
          text: item.text
        }
      })
    );
  }

  handleItemClick(event) {
    const itemId = event.target.dataset.itemId;
    const item = this.getItemById(itemId);

    if (DEBUG) {
      console.debug(CLASS_NAME, "handleItemClick", JSON.stringify(item));
    }

    this.dispatchEvent(
      new CustomEvent("itemclick", {
        detail: {
          id: itemId,
          text: item.text,
          url: item.url
        }
      })
    );
  }

  handleNavListToggle(event) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleNavListToggle",
        JSON.stringify(event.detail)
      );
    }

    this.dispatchEvent(
      new CustomEvent("togglemenuitem", {
        detail: event.detail
      })
    );
  }

  handleNavListItemClick(event) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleNavListItemClick",
        JSON.stringify(event.detail)
      );
    }

    this.dispatchEvent(
      new CustomEvent("itemclick", {
        detail: event.detail
      })
    );
  }
}
