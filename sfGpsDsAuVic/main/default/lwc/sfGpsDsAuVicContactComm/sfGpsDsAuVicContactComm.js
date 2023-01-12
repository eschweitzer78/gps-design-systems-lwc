import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

const socialIconScale = {
  facebook: 1,
  instagram: 0.81,
  linkedin: 0.81,
  twitter: 0.81,
  youtube: 0.81,
  default: 0.81
};

export default class SfGpsDsAuVicContactComm extends SfGpsDsLwc {
  static renderMode = "light";

  @api title; //: String,
  @api name; //: String,
  @api department; //: String,
  @api postal; //: String,
  @api address; //: String,
  @api className; //: String

  /* phone: Array({ title, number }) */
  _phone; //: Array,
  _originalPhone;

  @api get phone() {
    return this._originalPhone;
  }

  set phone(value) {
    this._originalPhone = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) {
          value = [value];
        }
      } catch (e) {
        value = [];
        this.addError(
          "JS-PH",
          "The phone attribute must be in JSON array format { title, number }."
        );
      }
    }

    this._phone = value;
  }

  @api email; //: String,

  /* social: Array({ icon, url, title }) */

  _social;
  _originalSocial;

  @api get social() {
    return this._originalSocial;
  }

  set social(value) {
    this._originalSocial = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) {
          value = [value];
        }
      } catch (e) {
        value = [];
        this.addError(
          "JS-SO",
          "The social attribute must be in JSON array format."
        );
      }
    }

    this._social = value;
  }

  get showList() {
    return this.title || this.list;
  }

  get list() {
    const _list = [];
    if (this.address) {
      _list.push({
        link: this.addressLink,
        symbol: "map_marker",
        text: this.address
      });
    }
    if (this._phone && this._phone.length > 0) {
      this._phone.forEach((phone) => {
        if (phone.number) {
          _list.push({
            symbol: "phone_number",
            link: `tel:${phone.number.replace(/ /g, "")}`,
            size: 0.857,
            text: `${phone.title ? phone.title + " " : ""}${phone.number}`
          });
        }
      });
    }

    if (this.email) {
      _list.push({
        symbol: "email_solid",
        link: `mailto:${this.email}`,
        size: 0.65,
        text: this.email
      });
    }

    if (this._social && this._social.length > 0) {
      this._social.forEach((link) => {
        _list.push({
          symbol: link.icon,
          link: link.url,
          size: socialIconScale[link.icon] || socialIconScale.default,
          text: link.title
        });
      });
    }

    return _list;
  }

  get addressLink() {
    return `https://www.google.com.au/maps?q=${encodeURI(this.address)}`;
  }

  get computedClassName() {
    return computeClass({
      "rpl-contact": true,
      [this.className]: this.className
    });
  }
}
