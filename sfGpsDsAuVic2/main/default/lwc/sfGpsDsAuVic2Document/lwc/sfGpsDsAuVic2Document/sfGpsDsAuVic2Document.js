import { LightningElement, api, track } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const GLOBAL_EVENTS_DEFAULT = false;
const OPEN_INW_DEFAULT = false;

export default class extends LightningElement {
  @api url;
  @api download;
  @api className;

  /* api: openInNewWindow */

  _openInNewWindow = OPEN_INW_DEFAULT;
  _openInNewWindowOriginal = OPEN_INW_DEFAULT;

  @api
  get openInNewWindow() {
    return this._openInNewWindowOriginal;
  }

  set openInNewWindow(value) {
    this._openInNewWindowOriginal = value;
    this._openInNewWindow = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: globalEvents */

  _globalEvents = GLOBAL_EVENTS_DEFAULT;
  _globalEventsOriginal = GLOBAL_EVENTS_DEFAULT;

  @api
  get globalEvents() {
    return this._globalEventsOriginal;
  }

  set globalEvents(value) {
    this._globalEventsOriginal = value;
    this._globalEvents = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* tracked */

  @track _hasIconSlot;
  @track _hasNameSlot;
  @track _hasInfoSlot;
  @track _hasCaptionSlot;

  /* computed */

  get computedClassName() {
    return {
      "rpl-document": true,
      "rpl-document--centered": this._hasInfoSlot,
      [this.className]: this.className
    };
  }

  get computedTarget() {
    return this.openInNewWindow ? "_blank" : null;
  }

  get computedIconStyle() {
    return this._hasIconSlot ? null : "display: none";
  }

  get computedNameStyle() {
    return this._hasNameSlot ? null : "display: none";
  }

  get computedInfoStyle() {
    return this._hasInfoSlot ? null : "display: none";
  }

  get computedCaptionStyle() {
    return this._hasCaptionSlot ? null : "display: none";
  }

  /* event management */

  handleClick() {
    const nameSlot = this.querySelector("slot[name='name']");

    this.dispatchEvent(
      new CustomEvent("download", {
        detail: {
          action: "download",
          text: nameSlot?.textContent,
          value: this.url
        },
        bubble: this._globalEvents
      })
    );
  }

  handleSlotChange(event) {
    switch (event.target.name) {
      case "icon":
        this._hasIconSlot = true;
        break;

      case "name":
        this._hasNameSlot = true;
        break;

      case "info":
        this._hasInfoSlot = true;
        break;

      case "caption":
        this._hasCaptionSlot = true;
        break;

      default:
    }
  }
}
