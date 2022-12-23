import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class sfGpsDsAuVicLink extends SfGpsDsLwc {
  @api href;
  @api target;
  @api innerWrap = false;
  @api text;

  externalLinksInNewWindow = false;

  renderedCallback() {
    let elt = this.template.querySelector("a");
    let value = window
      .getComputedStyle(elt)
      .getPropertyValue("--rpl-external-links-in-new-window");
    this.externalLinksInNewWindow = value && value.includes("true");
  }

  get printUrl() {
    let value = "";

    try {
      value = this.href ? new URL(this.href).href : null;
    } catch (e) {
      return this.href;
    }

    return value;
  }

  get linkTarget() {
    if (!this.target) {
      return null;
    }

    if (this.target.length === 0 && this.externalLinksInNewWindow) {
      if (this.isExternalUrl(this.href)) {
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

  isExternalUrl(url) {
    const tmp = document.createElement("a");
    tmp.href = url;
    return tmp.host !== window.location.host;
  }
}
