import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { NavigationMixin } from "lightning/navigation";

export default class SfGpsDsAuNswButtonComm extends NavigationMixin(
  SfGpsDsLwc
) {
  @api cstyle;
  @api rendering;
  @api type;
  @api disabled = false;
  @api iconStyle; // one of none, before, after
  @api iconName;
  @api mobileFullWidth = false;
  @api className;

  /*
   * link
   */

  @track _link = { text: null, url: null };
  _originalLink;

  @api get link() {
    return this._originalLink;
  }

  set link(markdown) {
    this._originalink = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing Link markdown");
      this._link = { text: null, url: null };
    }
  }

  get isButton() {
    return this.rendering === "button";
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  /* events */

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
}
