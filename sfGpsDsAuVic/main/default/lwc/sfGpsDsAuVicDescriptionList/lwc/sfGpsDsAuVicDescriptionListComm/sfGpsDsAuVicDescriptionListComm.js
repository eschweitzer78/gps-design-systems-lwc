import { api } from "lwc";
import { isString, toArray } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const LIST_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api divider = ":";
  @api className;

  /* api: list */

  _list = LIST_DEFAULT;
  _listOriginal = LIST_DEFAULT;

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
        value = LIST_DEFAULT;
        this.addError(
          "JS-LI",
          "The list attribute must be in JSON array format of term and description."
        );
      }
    } else {
      value = LIST_DEFAULT;
    }

    this._list = value;
  }
}
