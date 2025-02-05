import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseBoolean, isExternalUrl } from "c/sfGpsDsHelpers";

const INNERWRAP_DEFAULT = false;

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api href;
  @api target;
  @api text;
  @api className;

  /* api: innerWrap */

  _innerWrap = INNERWRAP_DEFAULT;
  _innerWrapOriginal = INNERWRAP_DEFAULT;

  @api set innerWrap(value) {
    this._innerWrapOriginal = value;
    this._innerWrap = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: INNERWRAP_DEFAULT
    });
  }

  get innerWrap() {
    return this._innerWrapOriginal;
  }

  /* computed */

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

    if (this.target.length === 0 && this._externalLinksInNewWindow) {
      if (isExternalUrl(this.href)) {
        return "_blank";
      }
    } else {
      return this.target.length > 0 ? this.target : false;
    }

    return null;
  }

  get computedClassName() {
    return {
      "rpl-link": true,
      [this.className]: this.className
    };
  }

  /* event management */

  handleFocus() {
    this.dispatchEvent(new CustomEvent("focus"));
  }

  /* lifecycle */

  _externalLinksInNewWindow = false;

  renderedCallback() {
    const elt = this.hostElement;
    const value = getComputedStyle(elt).getPropertyValue(
      "--rpl-external-links-in-new-window"
    );
    this._externalLinksInNewWindow = value;
  }
}
