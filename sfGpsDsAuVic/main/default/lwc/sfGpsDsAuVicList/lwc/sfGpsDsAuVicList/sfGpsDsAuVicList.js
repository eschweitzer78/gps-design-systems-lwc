import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isArray, toArray, normaliseString, isString } from "c/sfGpsDsHelpers";

const SIZE_DEFAULT = "normal";
const SIZE_VALUES = {
  normal: "rpl-list--normal",
  large: "rpl-list--large"
};

const LIST_DEFAULT = [];
const ICONSCALE_DEFAULT = 1;

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api title; //: String,
  @api link; //: String,
  @api iconColor = "primary"; //: { type: String, default: 'primary' },
  @api className;

  /* api: size */

  _size = SIZE_VALUES[SIZE_DEFAULT];
  _sizeOriginal = SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;

    this._size = normaliseString(value, {
      validValues: SIZE_VALUES,
      fallbackValue: SIZE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: iconScale //: { type: Number, default: 1 } */

  _iconScale = ICONSCALE_DEFAULT;
  _iconScaleOriginal = ICONSCALE_DEFAULT;

  @api
  get iconScale() {
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

  /* api: list */

  _list; //: Array
  _listOriginal;
  _listParsed;

  @api
  get list() {
    return this._listOriginal;
  }

  set list(value) {
    this._listOriginal = value;

    if (isString(value)) {
      try {
        value = toArray(JSON.parse(value));
      } catch (e) {
        this.addError("LI-JP", "Issue when parsing list JSON content");
      }
    }

    if (!isArray(value) || value == null) {
      value = LIST_DEFAULT;
    }

    this._listParsed = value;
    this.updateList();
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-list": true,
      [this._size]: this._size,
      [this.className]: this.className
    };
  }

  get computedLink() {
    return {
      text: this.title,
      link: this.link
    };
  }

  get computedListHasItems() {
    return this._list?.length > 0;
  }

  /* methods */

  updateList() {
    if (this._listParsed == null) {
      return;
    }

    this._list = this._listParsed.map((item, index) => {
      let itemSize = 1;

      if (item.size === "normal") {
        itemSize = 1;
      } else if (isString(item.size)) {
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
}
