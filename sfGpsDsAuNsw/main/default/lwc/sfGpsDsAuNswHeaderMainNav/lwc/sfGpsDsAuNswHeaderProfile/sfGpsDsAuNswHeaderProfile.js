import { LightningElement, api, track } from "lwc";
import OnClickOutside from "c/sfGpsDsOnClickOutside";

export default class extends LightningElement {
  @api signInLabel = "Log in";
  @api isGuest;
  @api userAlias;
  @api navItems;
  @api className;

  @track isOpen = false;

  /* event management */

  handleOpenProfile() {
    this.isOpen = true;
  }

  handleCloseProfile() {
    this.isOpen = false;
  }

  handleLogin() {
    this.dispatchEvent(new CustomEvent("login"));
  }

  handleClickNavigate(event) {
    event.preventDefault();

    let index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  ignore(event) {
    event.stopPropagation();
    return false;
  }

  /* lifecycle */

  _onClickOutside;

  renderedCallback() {
    if (!this._onClickOutside) {
      this._onClickOutside = new OnClickOutside();
      this._onClickOutside.bind(this, "containerRef", () => {
        this.isOpen = false;
      });
    }
  }

  disconnectedCallback() {
    if (this._onClickOutside) {
      this._onClickOutside.unbind(this, "containerRef");
      this._onClickOutside = null;
    }
  }
}
