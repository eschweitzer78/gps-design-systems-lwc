import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsAuVic2ExpandableStateMixin";

const DEBUG = false;

export default class SfGpsDsAuVic2VerticalNav extends ExpandableStateMixin(
  LightningElement
) {
  @api title;
  @api className;

  /* getters */

  get computedClassName() {
    return computeClass({
      "rpl-vertical-nav": true,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
  }

  get _decoratedItems() {
    if (DEBUG)
      console.log(
        "> SfGpsDsAuVic2VerticalNav.decoratedItems",
        JSON.stringify(this._items)
      );

    // Because the top level items with children aren't actually links, we need to ensure that
    // the first child of each top level item is a link to that page. These links
    // have the same label as the parent item.

    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname;
    const rv = (this._items || []).map((baseItem) => {
      const isCurrentPage =
        baseItem.url === pathname ||
        (baseItem.url && pathname.startsWith(baseItem.url + "/"));

      return {
        ...baseItem,
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
      console.log(
        "< SfGpsDsAuVic2VerticalNav.decoratedItems",
        JSON.stringify(rv)
      );

    return rv;
  }

  /* methods */

  mapItem(item, index, length, active) {
    if (DEBUG)
      console.log(
        "> SfGpsDsAuVic2VerticalNav.mapItem",
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

    if (DEBUG)
      console.log("< SfGpsDsAuVic2VerticalNav.mapItem", JSON.stringify(rv));

    return rv;
  }

  toggleId(itemId) {
    return `rpl-vertical-nav-${itemId}-toggle`;
  }

  handleToggle(event) {
    const itemId = event.target.dataset.itemId;
    const item = this.getItemById(itemId);

    this.toggleItem(itemId);

    this.dispatchEvent(
      new CustomEvent("togglemenuitem", {
        detail: {
          id: this.toggleId(itemId),
          action: this.isItemExpanded(itemId) ? "open" : "close",
          text: item.text,
          name: this.title
        }
      })
    );
  }

  handleClick(event) {
    event.preventDefault();

    const itemId = event.target.dataset.itemId;

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: itemId
      })
    );
  }
}
