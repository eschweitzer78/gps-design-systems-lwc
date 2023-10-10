import { LightningElement, api, track } from "lwc";

export default class SfGpsDsAuNswHeaderProfile extends LightningElement {
  @api signInLabel = "Log in";
  @api isGuest;
  @api userAlias;
  @api navItems;
  @api className;

  @track isOpen = false;

  _justOpened;

  handleOpenProfile() {
    this.isOpen = true;
    this._justOpened = true;
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

  handleOutsideClick() {
    if (!this._justOpened) {
      this.isOpen = false;
    } else {
      this._justOpened = false;
    }
  }

  _handler;

  connectedCallback() {
    document.addEventListener(
      "click",
      (this._handler = this.handleOutsideClick.bind(this))
    );
  }

  disconnectedCallback() {
    document.removeEventListener("click", this._handler);
  }
}
