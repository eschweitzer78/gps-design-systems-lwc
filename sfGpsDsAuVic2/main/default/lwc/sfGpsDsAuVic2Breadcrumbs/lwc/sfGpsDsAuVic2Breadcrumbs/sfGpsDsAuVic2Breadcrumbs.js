import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Breadcrumbs extends LightningElement {
  /* api: items */

  _itemsOriginal;
  _items;

  @api get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    this._items = value
      ? value.map((item, index) => ({
          ...item,
          key: `item-${index + 1}`,
          className: computeClass({
            "rpl-breadcrumbs__item": true,
            "rpl-breadcrumbs__item--parent": index === this.items.length - 2
          })
        }))
      : null;
  }

  @api besideQuickExit = false;
  @api className;
  @api preventDefault = false;

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-breadcrumbs": true,
      "rpl-u-screen-only": true,
      "rpl-breadcrumbs--beside-exit": this.besideQuickExit
    });
  }

  /* event management */

  handleClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }

    const index = event.target.dataset.ndx;

    if (
      this._items == null ||
      index == null ||
      index < 0 ||
      index >= this._items.length
    ) {
      return;
    }

    const item = this._items[index];

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          text: item?.text,
          value: item?.url,
          index: index + 1
        }
      })
    );
  }
}
