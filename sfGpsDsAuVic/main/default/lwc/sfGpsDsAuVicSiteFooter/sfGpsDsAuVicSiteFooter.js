import { LightningElement, api, track } from "lwc";

export default class SfGpsDsAuVicSiteFooter extends LightningElement {
  @api nav; // [{ text, url, children [] }]
  @api socialLinks; // obj { title, children [ { title uri icon } ]}
  @api acknowledgement; // string
  @api caption; // string
  @api links; // [{ text url }]
  @api copyright; // string

  _originalFooterLogos;
  @track _footerLogos;

  @api set footerLogos(value) {
    // [ { src, alt, url }]
    this._originalFooterLogos = value;
    this.updateFooterLogos();
  }

  get footerLogos() {
    return this._originalFooterLogos;
  }

  _masterbrand = {
    src: "/sfsites/c/resource/sfGpsDsAuVic/images/vic-logo.svg",
    alt: "Victoria – logo – Victoria Government - home",
    url: "https://vic.gov.au"
  };

  @api set masterbrand(value) {
    this._masterbrand = value;
    this.updateFooterLogos();
  }

  get masterbrand() {
    return this._masterbrand;
  }

  updateFooterLogos() {
    let value =
      this._originalFooterLogos && Array.isArray(this._originalFooterLogos)
        ? this._originalFooterLogos.map((item, index) => ({
            ...item,
            key: "fl-" + (index + 1)
          }))
        : [];

    if (this.masterbrand && this.masterbrand.src) {
      value.push({ ...this.masterbrand, key: "fl-masterbrand" });
    }

    this._footerLogos = value;
  }
}
