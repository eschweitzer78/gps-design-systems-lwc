import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const LINK_DEFAULT = {};

export default class extends SfGpsDsLwc {
  @api alertId;
  @api variant;
  @api iconName;
  @api message;
  @api dismissed;
  @api isDismissible;
  @api className;

  /* api: link */

  _link = LINK_DEFAULT;
  _linkOriginal = LINK_DEFAULT;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown
        ? mdEngine.extractFirstLink(markdown)
        : LINK_DEFAULT;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
      this._link = LINK_DEFAULT;
    }
  }

  /* computed */

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
