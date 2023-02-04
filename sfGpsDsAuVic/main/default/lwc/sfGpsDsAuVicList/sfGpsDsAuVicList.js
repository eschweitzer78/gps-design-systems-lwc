import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicRplList extends SfGpsDsLwc {
  static renderMode = "light";

  @api title; //: String,
  @api link; //: String,
  @api size = "normal"; //: { type: String, default: 'normal' = "large"},

  /* api iconScale //: { type: Number, default: 1 } */

  _iconScaleOriginal = 1;
  _iconScale;

  @api get iconScale() {
    return this._iconScaleOriginal;
  }

  set iconScale(value) {
    this._iconScaleOriginal = value;

    if (typeof value === "number") {
      this._iconScale = value;
    } else {
      let floatValue =
        typeof value?.toString === "function"
          ? parseFloat(value.toString())
          : 1;
      this._iconScale = isNaN(floatValue) ? 1 : floatValue;
    }

    this.updateList();
  }

  @api iconColor = "primary"; //: { type: String, default: 'primary' },

  /* api list */

  _list; //: Array
  _listOriginal;
  _listParsed;

  @api get list() {
    return this._listOriginal;
  }

  set list(value) {
    this._listOriginal = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) value = [value];
      } catch (e) {
        console.log(e);
      }
    }

    if (!Array.isArray(value) || value == null) {
      return;
    }

    this._listParsed = value;
    this.updateList();
  }

  updateList() {
    if (this._listParsed == null) {
      return;
    }

    this._list = this._listParsed.map((item, index) => {
      let itemSize = 1;

      if (item.size === "normal") {
        itemSize = 1;
      } else if (typeof item.size === "string") {
        itemSize = parseFloat(item.size);
      } else if (typeof item.size === "number") {
        itemSize = item.size;
      }

      return {
        ...item,
        key: `item-${index + 1}`,
        iconSize: (itemSize * this._iconScale).toString(),
        color: item.color || this.iconColor
      };
    });
  }

  @api className;

  get computedClass() {
    return computeClass({
      "rpl-list": true,
      "rpl-list--normal": this.size === "normal",
      "rpl-list--large": this.size === "large",
      [this.className]: this.className
    });
  }

  get computedLink() {
    return {
      text: this.title,
      link: this.link
    };
  }
}
