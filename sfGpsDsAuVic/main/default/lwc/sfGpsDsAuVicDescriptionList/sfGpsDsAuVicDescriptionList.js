import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicDescriptionList extends LightningElement {
  static renderMode = "light";

  @api divider = ":";
  @api className;

  _listOriginal;
  @track _list;

  /* api list { term: string, description: string }] */

  @api
  get list() {
    return this._listOriginal;
  }

  set list(value) {
    this._listOriginal = value;

    if (value && Array.isArray(value)) {
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
    return computeClass({
      "rpl-description-list": true,
      [this.className]: this.className
    });
  }
}
