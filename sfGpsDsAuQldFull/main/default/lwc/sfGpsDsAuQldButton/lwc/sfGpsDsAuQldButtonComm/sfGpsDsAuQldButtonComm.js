import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { NavigationMixin } from "lightning/navigation";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldButtonComm";

export default class extends NavigationMixin(SfGpsDsLwc) {
  @api el;
  @api variant;
  @api iconName;
  @api iconPosition;
  @api disabled;
  @api className;

  /* api: link */

  _link;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    this._linkOriginal = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this._link = null;
      this.addError("ML-MD", "Issue when parsing Link markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set link", e);
    }
  }

  /* computed */

  get computedLabel() {
    return this._link?.text;
  }

  get computedUrl() {
    return this._link?.url;
  }

  /* event management */

  handleClick() {
    if (this._link?.url && !this.disabled) {
      this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
          url: this._link.url
        }
      });
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
