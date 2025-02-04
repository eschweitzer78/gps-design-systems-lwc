import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { NavigationMixin } from "lightning/navigation";

const LINK_DEFAULT = {};

export default class extends NavigationMixin(SfGpsDsLwc) {
  @api el;
  @api variant;
  @api theme;
  @api iconName;
  @api iconPosition;
  @api disabled;
  @api busy;
  @api className;

  /* api: link */

  _link = LINK_DEFAULT;
  _linkOriginal = LINK_DEFAULT;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    this._linkOriginal = markdown;

    try {
      this._link = markdown
        ? mdEngine.extractFirstLink(markdown)
        : LINK_DEFAULT;
    } catch (e) {
      this._link = LINK_DEFAULT;
      this.addError("ML-MD", "Issue when parsing Link markdown");
    }
  }

  /* computed */

  get computedLabel() {
    return this._link?.text;
  }

  get computedUrl() {
    return this._link?.url;
  }

  /* events */

  handleClick() {
    if (this._link?.url && !this.disabled && !this.busy) {
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
    this.classList.add("vic2-scope");
  }
}
