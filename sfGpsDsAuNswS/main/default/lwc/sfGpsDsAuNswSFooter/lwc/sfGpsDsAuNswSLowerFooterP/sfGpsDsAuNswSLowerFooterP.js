import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class extends SfGpsDsNavigation {
  @api className;

  /* api: mode, String */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;
  }

  /* api: navigationDevName, String */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* event management */

  handleNavigate(event) {
    if (this._map && event.detail) {
      this.dispatchEvent(
        new CustomEvent("navigate", {
          detail: {
            ...this._map[event.detail]
          }
        })
      );
    }
  }
}
