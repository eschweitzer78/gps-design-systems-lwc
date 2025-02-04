import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, toArray } from "c/sfGpsDsHelpers";

const NETWORKS_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api title;
  @api label;
  @api emailSubject;
  @api emailBody;
  @api className;

  /* api: url */

  _url = document.URL;
  _urlOriginal = document.URL; // works with LWS/LWR

  @api
  get url() {
    return this._urlOriginal;
  }

  set url(value) {
    this._urlOriginal = value;
    this._url = value || document.URL; // works with LWS/LWR
  }

  /* api: networks */

  _networks = NETWORKS_DEFAULT;
  _networksOriginal = NETWORKS_DEFAULT;

  @api
  get networks() {
    return this._networksOriginal;
  }

  set networks(value) {
    this._networksOriginal = value;

    if (isString(value)) {
      try {
        value = toArray(JSON.parse(value));
      } catch (e) {
        value = NETWORKS_DEFAULT;
        this.addError(
          "JS-NW",
          "The networks attribute must be in JSON array format { name, label, iconName, iconSize }."
        );
      }
    } else {
      value = NETWORKS_DEFAULT;
    }

    this._networks = value;
  }
}
