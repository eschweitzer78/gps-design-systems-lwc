import {
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import {
  computeClass
} from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

const ISEXPANDED_DEFAULT = false;
const PREVENTDEFAULT_DEFAULT = false;
const LEVEL_DEFAULT = 1;
const TOGGLELEVELS_DEFAULT = 0;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2VerticalNavList";

export default 
class SfGpsDsAuVic2VerticalNavList 
extends ExpandableStateMixin<SfGpsDsElement>(SfGpsDsElement) {
  // @ts-ignore
  @api 
  level?: number;
  _childLevel = LEVEL_DEFAULT + 1;
  _level = this.defineIntegerProperty("level", {
    defaultValue: LEVEL_DEFAULT,
    // eslint-disable no-unused-vars
    watcher: () => {
      this._childLevel = this._level.value + 1;
    }
  });


  // @ts-ignore
  @api 
  toggleLevels?: boolean;
  _toggleLevels = this.defineIntegerProperty("toggleLevels", {
    defaultValue: TOGGLELEVELS_DEFAULT
  });

  // @ts-ignore
  @api 
  isExpanded?: boolean;
  _tabindex = "-1";
  _isExpanded = this.defineBooleanProperty("isExpanded", {
    defaultValue: ISEXPANDED_DEFAULT,
    // eslint-disable no-unused-vars
    watcher: () => {
      this._tabindex = this._isExpanded.value ? "0" : "-1";
    }
  });

  // @ts-ignore
  @api 
  preventDefault?: boolean;
  _preventDefault = this.defineBooleanProperty("preventDefault", {
    defaultValue: PREVENTDEFAULT_DEFAULT
  });

  // @ts-ignore
  @api 
  className?: string;

  /* computed */

  get computedClassName(): any {
    return {
      "rpl-vertical-nav__list": true,
      [`rpl-vertical-nav__list--level-${this._level.value}`]: true,
      "rpl-type-p-small": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedIsExpandable() {
    return this._items?.length && this._level.value <= this._toggleLevels.value;
  }

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

  mapItem(
    item: any, 
    index: number, 
    length: number, 
    active: boolean
  ): any {
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

  toggleId(itemId: string): string {
    return `rpl-vertical-nav-${itemId}-toggle`;
  }

  showIcon(index: number) {
    const hasIcon = this._level.value > Math.max(this._toggleLevels.value, 2);

    return index === 0 && this._level.value - 1 <= this._toggleLevels.value
      ? false
      : hasIcon;
  }

  /* event management */

  handleToggle(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;
    const itemId = target.dataset.itemId;
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

  handleItemClick(
    event: CustomEvent
  ): void {
    const target: HTMLElement = event.target as HTMLElement;
    const itemId = target.dataset.itemId;
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

  handleNavListToggle(
    event: CustomEvent
  ): void {
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

  handleNavListItemClick(
    event: CustomEvent
  ): void {
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
