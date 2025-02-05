import { api } from "lwc";
import demoFooter from "./demoFooter";
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

    if (value === "Demo") {
      this._items = this.mapIpData(demoFooter);
    }
  }

  /* api: navigationDevName, String */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName, String */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON, String */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* event management */

  handleNavClick(event) {
    if (this._map && event.detail) {
      this.refs.navsvc.navigateNavMenu(this._map[event.detail]);
    }
  }
}
