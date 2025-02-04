import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api besideQuickExit = false;
  @api className;
  @api preventDefault = false;

  /* api: items */

  _items;
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    this._items = value
      ? value.map((item, index) => ({
          ...item,
          key: `item-${index + 1}`,
          className: {
            "rpl-breadcrumbs__item": true,
            "rpl-breadcrumbs__item--parent": index === this.items.length - 2
          }
        }))
      : null;
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-breadcrumbs": true,
      "rpl-u-screen-only": true,
      "rpl-breadcrumbs--beside-exit": this.besideQuickExit,
      [this.className]: this.className
    };
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
