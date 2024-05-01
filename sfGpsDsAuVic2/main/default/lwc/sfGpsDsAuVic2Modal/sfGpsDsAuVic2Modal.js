import { LightningElement, api, track } from "lwc";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpers";
import WindowSizeMixin from "c/sfGpsDsAuVic2WindowSizeMixin";

export default class SfGpsDsAuVic2Modal extends WindowSizeMixin(
  LightningElement
) {
  _isOpenOriginal;
  _isOpen;
  _setFocus;

  @api get isOpen() {
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

  @api closeLabel = "Close";
  @api className;

  @track hasBelowSlot = false;

  get computedClassName() {
    return computeClass({
      "rpl-modal": true,
      [this.className]: this.className
    });
  }

  get computedStyle() {
    return `--local-view-height: ${this._windowSize.height}px`;
  }

  get computedBelowStyle() {
    return this.hasBelowSlot ? null : "display: none";
  }

  get computedFocusTrapOptions() {
    return { immediate: true };
  }

  handleSlotChange() {
    this.hasBelowSlot = true;
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
