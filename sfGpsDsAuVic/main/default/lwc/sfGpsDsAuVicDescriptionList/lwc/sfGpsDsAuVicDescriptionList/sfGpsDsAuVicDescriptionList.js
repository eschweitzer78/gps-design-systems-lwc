import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api divider = ":";
  @api className;

  /* api: list { term: string, description: string }] */

  _list;
  _listOriginal;

  @api
  get list() {
    return this._listOriginal;
  }

  set list(value) {
    this._listOriginal = value;

    if (value && isArray(value)) {
      this._list = value.map((item, index) => ({
        ...item,
        key: `item-${index + 1}`
      }));
    } else {
      this._list = null;
    }
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-description-list": true,
      [this.className]: this.className
    };
  }
}
