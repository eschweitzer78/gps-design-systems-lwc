import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicTextLink extends SfGpsDsLwc {
  static renderMode = "light";

  @api iconSymbol; // String
  @api iconColor = "primary";
  @api iconPlacement = "after";
  @api iconSize = "m";
  @api link; // {text: String, url: String }
  @api className;

  _innerWrap = true;
  @api get innerWrap() {
    return this._innerWrap;
  }

  set innerWrap(value) {
    this._innerWrap = value;
  }

  @api underline = false;
  @api theme = "light";
  @api size; // String
  @api emphasis = false;

  /* api: text, alternative way of setting link */

  @api get text() {
    return this.link?.text;
  }

  set text(value) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.link = { ...this.link, text: value };
  }

  /* api: url, alternative way of setting link */

  @api get url() {
    return this.link?.url;
  }

  set url(value) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.link = { ...this.link, url: value };
  }

  get textDecoded() {
    return this.link ? this.link.text : "";
  }

  get iconSymbolFinal() {
    return this.isExternalUrl(this.link?.url)
      ? "external_link"
      : this.iconSymbol;
  }

  isExternalUrl(url) {
    const tmp = document.createElement("a");
    tmp.href = url;
    return tmp.host !== new URL(document.URL).host;
  }

  get computedClassName() {
    return computeClass({
      "rpl-text-link": true,
      "rpl-text-link--underline": this.underline,
      "rpl-text-link--dark": this.theme === "dark",
      [this.className]: this.className
    });
  }
}
