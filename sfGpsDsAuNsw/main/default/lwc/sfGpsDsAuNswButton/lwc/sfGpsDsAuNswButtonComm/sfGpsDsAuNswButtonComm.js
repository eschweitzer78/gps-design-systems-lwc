import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { NavigationMixin } from "lightning/navigation";

const LINK_DEFAULT = { text: null, url: null };

export default class extends NavigationMixin(SfGpsDsLwc) {
  @api cstyle;
  @api rendering;
  @api type;
  @api disabled = false;
  @api iconStyle; // one of none, before, after
  @api iconName;
  @api mobileFullWidth = false;
  @api className;

  /* api: link, String */

  _link = LINK_DEFAULT;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing Link markdown");
      this._link = LINK_DEFAULT;
    }
  }

  /* computed */

  get computedIsButton() {
    return this.rendering === "button";
  }

  /* event management */

  handleClick() {
    if (this._link?.url) {
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
    this.classList.add("nsw-scope");
  }
}
