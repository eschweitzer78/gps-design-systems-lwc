import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, toArray } from "c/sfGpsDsHelpers";

const socialIconScale = {
  facebook: 1,
  instagram: 0.81,
  linkedin: 0.81,
  twitter: 0.81,
  youtube: 0.81,
  default: 0.81
};

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api title; //: String,
  @api name; //: String,
  @api department; //: String,
  @api postal; //: String,
  @api address; //: String,
  @api className; //: String
  @api email; //: String,

  /* api: phone: Array({ title, number }) */

  _phone; //: Array,
  _phoneOriginal;

  @api
  get phone() {
    return this._phoneOriginal;
  }

  set phone(value) {
    this._phoneOriginal = value;

    if (isString(value)) {
      try {
        value = toArray(JSON.parse(value));
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

  /* social: Array({ icon, url, title }) */

  _social;
  _socialOriginal;

  @api
  get social() {
    return this._socialOriginal;
  }

  set social(value) {
    this._socialOriginal = value;

    if (isString(value)) {
      try {
        value = toArray(JSON.parse(value));
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

  /* computed */

  get computedShowList() {
    return this.title || this.computedList.length;
  }

  get computedList() {
    const _list = [];

    if (this.address) {
      _list.push({
        link: this.computedAddressLink,
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

  get computedAddressLink() {
    return `https://www.google.com.au/maps?q=${encodeURI(this.address)}`;
  }

  get computedClassName() {
    return {
      "rpl-contact": true,
      [this.className]: this.className
    };
  }
}
