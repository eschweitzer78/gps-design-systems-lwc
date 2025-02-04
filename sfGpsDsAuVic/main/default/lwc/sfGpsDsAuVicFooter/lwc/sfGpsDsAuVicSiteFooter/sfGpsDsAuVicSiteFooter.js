import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

const FOOTERLOGOS_DEFAULT = [];

export default class extends LightningElement {
  static renderMode = "light";

  @api nav; // [{ text, url, children [] }]
  @api socialLinks; // obj { title, children [ { title uri icon } ]}
  @api acknowledgement; // string
  @api caption; // string
  @api links; // [{ text url }]
  @api copyright; // string
  @api className;

  /* api: footer logos */

  _footerLogos = FOOTERLOGOS_DEFAULT;
  _footerLogosOriginal = FOOTERLOGOS_DEFAULT;

  @api
  get footerLogos() {
    return this._footerLogosOriginal;
  }

  set footerLogos(value) {
    // [ { src, alt, url }]
    this._footerLogosOriginal = value;
    this.updateFooterLogos();
  }

  /* api: masterbrand */

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

  /* computed */

  get computedHasFooterLogos() {
    return this._footerLogos.length > 0;
  }

  get computedClassName() {
    return {
      "rpl-site-footer": true,
      [this.className]: this.className
    };
  }

  /* methods */

  updateFooterLogos() {
    let value = isArray(this._footerLogosOriginal)
      ? this._footerLogosOriginal.map((item, index) => ({
          ...item,
          key: "fl-" + (index + 1)
        }))
      : [...FOOTERLOGOS_DEFAULT];

    if (this._masterbrand && this._masterbrand.src) {
      value.push({ ...this._masterbrand, key: "fl-masterbrand" });
    }

    this._footerLogos = value;
  }
}
