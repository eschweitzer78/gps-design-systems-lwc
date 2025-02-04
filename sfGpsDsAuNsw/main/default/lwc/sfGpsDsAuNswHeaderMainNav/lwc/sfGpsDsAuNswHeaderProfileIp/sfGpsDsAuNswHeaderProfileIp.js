import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class extends SfGpsDsNavigation {
  @api isGuest;
  @api userAlias;
  @api className;

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

  /* event management  */

  handleNavigate(event) {
    if (this._map && event.detail) {
      this.refs.navsvc.navigateNavMenu(this._map[event.detail]);
    }
  }

  handleLogin() {
    this.refs.navsvc.login();
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
