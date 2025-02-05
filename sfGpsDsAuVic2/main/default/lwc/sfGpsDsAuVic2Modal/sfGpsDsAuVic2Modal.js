import { LightningElement, api, track } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";
import WindowSizeMixin from "c/sfGpsDsAuVic2WindowSizeMixin";

export default class extends WindowSizeMixin(LightningElement) {
  @api closeLabel = "Close";
  @api className;

  @track _hasBelowSlot = false;

  /* api: isOpen */

  _isOpen;
  _isOpenOriginal;
  _setFocus;

  @api
  get isOpen() {
    return this._isOpenOriginal;
  }

  set isOpen(value) {
    this._isOpenOriginal = value;
    this._isOpen = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (this._isOpen) {
      document.body.classList.add("rpl-u-viewport-locked", "rpl-u-modal-open");
      this._setFocus = true;
    } else {
      document.body.classList.remove(
        "rpl-u-viewport-locked",
        "rpl-u-modal-open"
      );
    }
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-modal": true,
      [this.className]: this.className
    };
  }

  get computedStyle() {
    return `--local-view-height: ${this._windowSize.height}px`;
  }

  get computedBelowStyle() {
    return this._hasBelowSlot ? null : "display: none";
  }

  get computedFocusTrapOptions() {
    return { immediate: true };
  }

  /* event management */

  handleSlotChange() {
    this._hasBelowSlot = true;
  }

  handleCloseModal() {
    this.dispatchEvent(
      new CustomEvent("close", {
        detail: {
          action: "click",
          text: this.closeLabel
        }
      })
    );
  }

  handleEscapeKey(event) {
    if (event.key === "Escape" && this.isOpen) {
      this.handleCloseModal();
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this._isOpen && this._setFocus) {
      this._setFocus = false;

      const trap = this.refs.trap;

      if (trap) {
        trap.focus();
      }
    }
  }
}
