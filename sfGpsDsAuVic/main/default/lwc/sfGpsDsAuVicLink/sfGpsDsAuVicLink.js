import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  computeClass,
  normaliseBoolean,
  isExternalUrl
} from "c/sfGpsDsHelpers";

export default class sfGpsDsAuVicLink extends SfGpsDsLwc {
  static renderMode = "light";

  @api href;
  @api target;
  @api text;
  @api className;

  @track _innerWrap = false;
  _originalInnerWrap = false;

  @api set innerWrap(value) {
    this._originalInnerWrap = value;
    this._innerWrap = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  get innerWrap() {
    return this._originalInnerWrap;
  }

  externalLinksInNewWindow = false;

  renderedCallback() {
    /* TODO: find alternative as this does not work, at least in JEST
    let elt = this.querySelector("a");
    let value = getComputedStyle(elt).getPropertyValue("--rpl-external-links-in-new-window");
    this.externalLinksInNewWindow = value && value === "true";

    elt.target = this.linkTarget;
    */
  }

  get printUrl() {
    let value = "";

    try {
      value = this.href ? new URL(this.href)?.href : null;
    } catch (e) {
      return this.href;
    }

    return value;
  }

  get linkTarget() {
    if (!this.target || typeof this.target !== "string") {
      return null;
    }

    if (this.target.length === 0 && this.externalLinksInNewWindow) {
      if (isExternalUrl(this.href)) {
        return "_blank";
      }
    } else {
      return this.target.length > 0 ? this.target : false;
    }

    return null;
  }

  handleFocus() {
    this.dispatchEvent(new CustomEvent("focus"));
  }

  get computedClassName() {
    return computeClass({
      "rpl-link": true,
      [this.className]: this.className
    });
  }
}
