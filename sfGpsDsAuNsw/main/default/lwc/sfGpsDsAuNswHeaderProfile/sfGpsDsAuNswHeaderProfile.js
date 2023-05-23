import { LightningElement, api, track } from "lwc";
import cBasePath from "@salesforce/community/basePath";

export default class SfGpsDsAuNswHeaderProfile extends LightningElement {
  @api signInLabel = "Log in or sign up";
  @api isGuest;
  @api userAlias;
  @api navItems;
  @api className;

  @track isOpen = false;

  get computedLoginUrl() {
    return cBasePath + "/login";
  }

  _justOpened;

  handleOpenProfile() {
    this.isOpen = true;
    this._justOpened = true;
  }

  handleCloseProfile() {
    this.isOpen = false;
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
