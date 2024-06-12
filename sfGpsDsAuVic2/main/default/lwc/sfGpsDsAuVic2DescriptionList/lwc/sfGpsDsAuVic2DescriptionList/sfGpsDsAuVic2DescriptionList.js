import { LightningElement, api } from "lwc";
import {
  computeClass,
  normaliseBoolean,
  normaliseString
} from "c/sfGpsDsHelpers";

const RplDescriptionListVariant = ["default", "icon"];
const VARIANT_DEFAULT = "default";

export default class SfGpsDsAuVic2DescriptionList extends LightningElement {
  @api className;

  /* api: variant */

  _variantOriginal = VARIANT_DEFAULT;
  _variant = VARIANT_DEFAULT;

  @api get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: RplDescriptionListVariant,
      fallbackValue: VARIANT_DEFAULT
    });
  }

  /* api: inline */

  _inlineOriginal;
  _inline;

  @api get inline() {
    return this._inlineOriginal;
  }

  set inline(value) {
    this._inlineOriginal = value;
    this._inline = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }
  /* api: items */

  _itemsOriginal;
  _items = [];

  @api get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (!Array.isArray(value)) {
      this._items = [];
      return;
    }

    const iconOnly = this._variant === "icon";
    this._items = (value || []).map((item) => {
      return {
        ...item,
        inline: this._inline,
        iconOnly,
        className: computeClass({
          "rpl-description-list__inline-wrap": this._inline,
          "rpl-description-list__term": !this._inline,
          "rpl-description-list--with-icon": item.iconName,
          "rpl-description-list--only-icon": iconOnly,
          [item.className]: item.className
        }),
        termClassName: computeClass({
          "rpl-u-visually-hidden": iconOnly
        })
      };
    });
  }

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-description-list": true,
      "rpl-description-list--inline": this._inline,
      "rpl-type-p": true,
      [this.className]: this.className
    });
  }
}
