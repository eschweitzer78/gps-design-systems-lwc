import { LightningElement, api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicRplList extends SfGpsDsLwc {
  @api title; //: String,
  @api link; //: String,
  @api size = "normal"; //: { type: String, default: 'normal' = "large"},
  @api iconScale = 1; //: { type: Number, default: 1 },
  @api iconColor = "primary"; //: { type: String, default: 'primary' },

  _list; //: Array
  _originalList;

  @api set list(value) {
    this._originalList = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) value = [value];
      } catch (e) {}
    }

    if (!Array.isArray(value) || value == null) {
      return;
    }

    let index = 1;
    this._list = value.map((item) => ({
      ...item,
      key: `item-${index++}`,
      iconSize: (item.size || 1) * this.iconScale,
      color: item.color || this.iconColor
    }));
  }

  get list() {
    return this._originalList;
  }

  get computedClass() {
    return computeClass({
      "rpl-list": true,
      "rpl-list--normal": this.size === "normal",
      "rpl-list--large": this.size === "large"
    });
  }
}
