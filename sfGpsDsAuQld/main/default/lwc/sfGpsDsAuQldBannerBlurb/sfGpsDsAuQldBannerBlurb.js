import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuQldBanner extends LightningElement {
  static renderMode = "light";

  @api title;
  @api linkPrimary;
  @api linkSecondary;
  @api className;

  _backgroundGraphicOriginal;
  _backgroundGraphic;

  @api get backgroundGraphic() {
    return this._backgroundGraphicOriginal;
  }

  set backgroundGraphic(value) {
    this._backgroundGraphicOriginal = value;
    this._backgroundGraphic = value ? value.replaceAll("['\"]", "") : null;
  }

  get computedClassName() {
    return computeClass({
      "qg-banner-blurb": true,
      [this.className]: this.className
    });
  }

  get computedBannerStyle() {
    return this._backgroundGraphic
      ? `background: url("${this._backgroundGraphic}") no-repeat center/cover`
      : null;
  }

  handlePrimaryClick(event) {
    if (this.linkPrimary && this.linkPrimary.url) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent("click"));
  }
}
