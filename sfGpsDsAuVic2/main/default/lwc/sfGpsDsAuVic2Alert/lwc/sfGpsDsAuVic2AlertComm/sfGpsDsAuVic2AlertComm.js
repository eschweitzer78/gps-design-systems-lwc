import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuVic2AlertComm extends SfGpsDsLwc {
  @api alertId;
  @api variant;
  @api iconName;
  @api message;
  @api dismissed;
  @api isDismissible;
  @api className;

  /* api: link */

  _originalLink;
  @track _link;

  @api get link() {
    return this._originalLink;
  }

  set link(markdown) {
    this._originalLink = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
    }
  }

  get _linkText() {
    return this._link?.text;
  }

  get _linkUrl() {
    return this._link?.url;
  }

  get computedIconName() {
    return `icon-${this.iconName}`;
  }

  /* event management */

  handleDismiss(event) {
    this.dispatchEvent(
      new CustomEvent("dismiss", {
        detail: event.detail,
        bubbles: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
