import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicShareThisComm extends SfGpsDsLwc {
  _urlOriginal = window.location.href;
  _url = this._urlOriginal;

  @api get url() {
    return this._urlOriginal;
  }

  set url(value) {
    this._urlOriginal = value;
    this._url = value || window.location.href;
  }

  @api title;
  @api label;

  /* api networks */

  _networksOriginal;
  _networks;

  @api get networks() {
    return this._networksOriginal;
  }

  set networks(value) {
    this._networksOriginal = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) {
          value = [value];
        }
      } catch (e) {
        value = [];
        this.addError(
          "JS-NW",
          "The networks attribute must be in JSON array format { name, label, iconName, iconSize }."
        );
      }
    } else {
      value = [];
    }

    this._networks = value;
  }

  @api emailSubject;
  @api emailBody;
  @api className;
}
