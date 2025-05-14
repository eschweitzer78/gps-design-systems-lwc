import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2CardGridLwr";

/**
 * @slot Grid-Content
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  /* api: hasSideBar */

  _hasSideBar;

  @api
  get hasSidebar() {
    return this._hasSideBar;
  }

  set hasSidebar(value) {
    if (this._hasSideBar && !value)
      this.classList.remove("rpl-layout-card-grid--has-sidebar");
    else if (!this._hasSideBar && value)
      this.classList.add("rpl-layout-card-grid--has-sidebar");

    this._hasSideBar = value;
  }

  /* api: className */

  _className;

  @api
  get className() {
    return this._className;
  }

  set className(value) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> set className", value, this._className);

    if (this._className) this.classList.remove(...this._className.split(" "));
    this._className = value;
    if (this._className) this.classList.add(...this._className.split(" "));

    if (DEBUG) console.debug(CLASS_NAME, "< set className", this._className);
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("rpl-layout-card-grid");
  }
}
