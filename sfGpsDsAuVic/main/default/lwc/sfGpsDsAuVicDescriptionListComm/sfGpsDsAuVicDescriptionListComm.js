import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicDescriptionListComm extends SfGpsDsLwc {
  @api divider = ":";
  @api className;

  _listOriginal;
  _list;

  @api get list() {
    return this._listOriginal;
  }

  set list(value) {
    this._listOriginal = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) {
          value = [value];
        }
      } catch (e) {
        value = [];
        this.addError(
          "JS-LI",
          "The list attribute must be in JSON array format of term and description."
        );
      }
    } else {
      value = [];
    }

    this._list = value;
  }
}
