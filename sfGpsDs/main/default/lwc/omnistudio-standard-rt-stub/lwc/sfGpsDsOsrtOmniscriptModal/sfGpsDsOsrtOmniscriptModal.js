import { LightningElement, api } from "lwc";
import tmpl from "./sfGpsDsOsrtOmniscriptModal.html";

/**
 * @module ns/omniscriptModal
 * @extends LightningElement
 * @typicalname omniscriptModal
 */
export default class OmniscriptModal extends LightningElement {
  /**
   * @scope public (api)
   * @type {String}
   * @description Modal type. Valid types: success, error, info.
   */
  @api type;

  /**
   * @scope public (api)
   * @type {Boolean}
   * @description Hides modal header.
   */
  @api hideHeader;

  /**
   * @scope public (api)
   * @type {Boolean}
   * @description Hides modal footer.
   */
  @api hideFooter;

  /**
   * @scope public (api)
   * @type {String}
   * @description Stores theme layout.
   */
  @api layout;

  /**
   * @scope public (api)
   * @type {Boolean}
   * @description Flag to determine if modal was triggered on step or in between steps.
   */
  @api triggeredOnStep;

  _theme;
  _getModalClasses;
  _headerClasses;
  _footerClasses;
  _modalContainerClass;
  _modalContentContainerClass;
  _contentClasses;

  firstFocusableElement;
  lastFocusableElement;

  /**
   * @scope public
   * @description Closes the modal.
   * @returns {Void}
   */
  @api
  closeModal() {
    this.template.querySelector("div").style.display = "none";
  }

  /**
   * @scope public
   * @description Opens the modal.
   * @returns {Void}
   */
  @api
  openModal() {
    // Make the modal appear
    const modal = this.template.querySelector("div");
    modal.style.display = "block";
    modal.setAttribute("tabindex", -1);
    // Focus first interactive element if it exists, else focus the header
    let focusableElement = this.querySelector(
      "ul li:first-child lightning-button"
    );
    if (focusableElement == null) {
      focusableElement = this.querySelector("h1");
    }
    // If there's nothing to focus, focus the modal div
    if (focusableElement == null) {
      modal.focus();
    } else {
      focusableElement.focus();
    }
  }

  /**
   * @scope private
   * @description Overwrites native connectedCallback.
   * @returns {Void}
   */
  connectedCallback() {
    this._theme = this.layout === "newport" ? "nds" : "slds";
    this._modalClasses = `${this._theme}-modal ${this._theme}-fade-in-open ${
      this.triggeredOnStep === false ? this._theme + "-theme_default" : ""
    }`;
    this._headerClasses = `${this._theme}-modal__header ${this._theme}-text-heading_medium ${this._theme}-modal__header ${this._theme}-theme_alert-texture `;

    switch (this.type) {
      case "error":
        this._headerClasses += `${this._theme}-theme_error`;
        break;
      case "info":
        this._headerClasses += `${this._theme}-theme_info`;
        break;
      case "success":
        this._headerClasses += `${this._theme}-theme_success`;
        break;
      default:
        break;
    }

    this._modalContentContainerClass = `${this._theme}-modal__container`;
    this._contentClasses = `${this._theme}-modal__content ${this._theme}-p-around_medium`;
    this._footerClasses = `${this._theme}-modal__footer ${this._theme}-theme_default`;
    this._modalContainerClass = `${this._theme}-modal_prompt modal-container`;

    this._handleKeyDownOnLastElementInModal =
      this.handleKeyDownOnLastElementInModal.bind(this);
    this._handleKeyDownOnFirstElementInModal =
      this.handleKeyDownOnFirstElementInModal.bind(this);
  }

  renderedCallback() {
    if (!this.firstFocusableElement) {
      this.firstFocusableElement = this.querySelector(
        "ul li:first-child lightning-button"
      );
      if (this.firstFocusableElement) {
        this.firstFocusableElement.addEventListener(
          "keydown",
          this._handleKeyDownOnFirstElementInModal
        );
      }
    }

    if (!this.lastFocusableElement) {
      this.lastFocusableElement = this.querySelector(
        "ul li:last-child lightning-button"
      );
      if (this.lastFocusableElement) {
        this.lastFocusableElement.addEventListener(
          "keydown",
          this._handleKeyDownOnLastElementInModal
        );
      }
    }
  }

  handleKeyDownOnLastElementInModal(event) {
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;

    // close the modal if escape is pressed
    if (event.key === "Escape") {
      this.closeModal();
    }

    if (!isTabPressed) {
      return;
    }

    // ignore if shiftkey is held down
    if (!event.shiftKey && this.firstFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      this.firstFocusableElement.focus();
      event.preventDefault();
    }
  }

  handleKeyDownOnFirstElementInModal(event) {
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;

    // close the modal if escape is pressed
    if (event.key === "Escape") {
      this.closeModal();
    }

    if (!isTabPressed) {
      return;
    }

    // if shiftkey is held down then we're going backwards and should end up on last element
    if (event.shiftKey && this.lastFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      this.lastFocusableElement.focus();
      event.preventDefault();
    }
  }

  disconnectedCallback() {
    if (this.firstFocusableElement) {
      this.firstFocusableElement.removeEventListener(
        "keydown",
        this._handleKeyDownOnFirstElementInModal
      );
    }
    if (this.lastFocusableElement) {
      this.lastFocusableElement.removeEventListener(
        "keydown",
        this._handleKeyDownOnLastElementInModal
      );
    }
  }

  /**
   * @scope private
   * @description Overwrites native render.
   * @returns {Template}
   */
  render() {
    return tmpl;
  }
}
