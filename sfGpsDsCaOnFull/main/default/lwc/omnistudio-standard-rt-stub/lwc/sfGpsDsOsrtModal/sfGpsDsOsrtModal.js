import { LightningElement, api } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import sldsTemplate from "./modal_slds.html";
import ndsTemplate from "./modal_nds.html";

export default class VlocityModal extends LightningElement {
  @api theme = "slds";
  @api title;
  @api size;
  @api height;
  @api isModalOpen;
  @api extraclass;
  @api iconUrl =
    window.location && window.location.hostname === "localhost"
      ? "/static/slds"
      : "";
  @api hideclosebutton = false;
  @api hideheader;
  @api hidefooter;
  @api extraHeaderClass;
  @api extraFooterClass;
  @api minHeight;
  @api maxHeight;
  @api modalBackdropStyle;
  _firstRender = false;
  isHeightSet = false; // isHeightSet - this flag is used to set the height of the modal at first render
  _closeModal;
  _overflow;
  isParentModal = false;

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  @api get channelName() {
    return this._channelName;
  }
  set channelName(val) {
    this._channelName = val;
    if (this._channelName) {
      this._closeModal = this.closeModalWindow.bind(this);
      pubsub.register(this._channelName, {
        close: this._closeModal,
        data: this._closeModal
      });
    }
  }
  connectedCallback() {
    // add event listener
    this._closeModal = this.closeModalWindow.bind(this);
    this.template.addEventListener("closemodal", this._closeModal);
    if (!document.body.classList.contains("flyout-modal-is-open")) {
      this.isParentModal = true;
      this._overflow = document.body.style.overflow;
    }
  }

  disconnectedCallback() {
    // Removes event listener
    this.template.removeEventListener("closemodal", this._closeModal);
    if (this.channelName) {
      pubsub.unregister(this.channelName, {
        close: this._closeModal,
        data: this._closeModal
      });
    }
    if (document?.body?.style.overflow === "hidden") {
      document.body.style.overflow = this._overflow;
      document.body.classList.remove("flyout-modal-is-open");
    }
  }

  closeModalWindow(event) {
    this.closeModal();
    event.stopPropagation();
  }

  renderedCallback() {
    let ele = this.template.querySelector("div");
    const backdrop = this.template.querySelector(".slds-backdrop");
    if (this.modalBackdropStyle && backdrop && !this.rendered) {
      backdrop.style = this.modalBackdropStyle;
      this.rendered = true;
    }
    if (ele && !this._firstRender && this.isModalOpen) {
      ele.style.display = "block";
      this._firstRender = true;
    }

    const contentELe = this.template.querySelector(
      `.${this.theme}-modal__content`
    );
    if (contentELe && !this.isHeightSet) {
      if (this.height)
        contentELe.style.height = /^[0-9]+$/.test(this.height)
          ? this.height + "px"
          : this.height;
      else if (this.minHeight || this.maxHeight) {
        if (this.minHeight)
          contentELe.style.minHeight = /^[0-9]+$/.test(this.minHeight)
            ? this.minHeight + "px"
            : this.minHeight;
        if (this.maxHeight)
          contentELe.style.maxHeight = /^[0-9]+$/.test(this.maxHeight)
            ? this.maxHeight + "px"
            : this.maxHeight;
      } else contentELe.style.height = "auto";

      this.isHeightSet = true;
    }
  }

  trapFocus(event) {
    const targetClass = event?.currentTarget?.classList;
    if (
      targetClass &&
      targetClass.contains("modal-close-btn") &&
      event.shiftKey &&
      event.key === "Tab" &&
      event.type === "keydown"
    ) {
      this.isReverseFocus = true;
      this.template.querySelector(".last-focusable-element").focus();
      event.stopImmediatePropagation();
      Promise.resolve().then(() => {
        this.isReverseFocus = false;
        const lastFocusableEle = this.template.querySelector(
          ".last-focusable-element"
        );
        const focusEvent = new KeyboardEvent("keyup", {
          key: "Tab",
          shiftKey: true
        });
        lastFocusableEle.dispatchEvent(focusEvent);
      });
      //shift was down when tab was pressed
    } else if (
      targetClass &&
      targetClass.contains("last-focusable-element") &&
      event.type === "focus" &&
      !this.isReverseFocus
    ) {
      this.template.querySelector(".modal-close-btn").focus();
      event.preventDefault();
    }
  }

  get getModalClasses() {
    let modalClass = `${this.theme}-modal ${this.theme}-fade-in-open`;
    if (this.size) {
      modalClass += ` ${this.theme}-modal_${this.size}`;
    }
    if (this.extraclass) {
      modalClass += ` ${this.extraclass}`;
    }
    return modalClass;
  }

  get headerClasses() {
    let headerClass =
      `${this.theme}-modal__header ` +
      (this.extraHeaderClass ? this.extraHeaderClass : "");
    if (this.hideheader) {
      headerClass += ` ${this.theme}-modal__header_empty`;
    }
    return headerClass;
  }

  get footerClasses() {
    let footerClass =
      `${this.theme}-modal__footer ` +
      (this.extraFooterClass ? this.extraFooterClass : "");
    return footerClass;
  }

  fireEvent(eventName, data) {
    const selectedEvent = new CustomEvent(eventName, { detail: data });
    this.dispatchEvent(selectedEvent);
  }

  @api
  closeModal() {
    this.template.querySelector("div").style.display = "none";
    this.fireEvent("close", {});
    // Enable scroll only if it is a parent modal component. Skip this logic for a modal getting opened inside another modal.
    if (this.isParentModal) {
      document.body.style.overflow = this._overflow;
      document.body.classList.remove("flyout-modal-is-open");
    }
  }
  @api
  openModal() {
    this.template.querySelector("div").style.display = "block";
    this.fireEvent("open", {});
    // Disable scroll only if it is a parent modal component. Skip this logic for a modal getting opened inside another modal.
    if (this.isParentModal) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("flyout-modal-is-open");
    }
    const closeButton = this.template.querySelector(".modal-close-btn");
    // eslint-disable-next-line no-unused-expressions
    closeButton?.focus();
  }

  get flyoutAriaLabel() {
    return "Flyout Modal Dialog";
  }

  handleModalKeyDown(e) {
    const { ctrlKey, metaKey, shiftKey, key } = e;
    const hasModifier = ctrlKey || metaKey || shiftKey;
    if (!hasModifier && (key === "Esc" || key === "Escape")) {
      e.stopPropagation();
      e.preventDefault();
      this.closeModal();
    }
  }
}
