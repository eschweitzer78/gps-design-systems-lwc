import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const CSTYLE_DEFAULT = "narrow";
const CSTYLE_VALUES = {
  wide: "rpl-call-to-action--without-sidebar",
  narrow: "rpl-call-to-action--with-sidebar"
};
export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  // @api summary: replaced by slot
  @api link; // { text: String, link: String }
  @api image; // { src*: String, alt: String, width: Number, height: Number }
  @api className;

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-call-to-action": true,
      "rpl-call-to-action__no-image": !this.image,
      [this._cstyle]: this._cstyle,
      [this.className]: this.className
    };
  }

  get _defaultSrcSet() {
    return [{ size: "xs", height: 249, width: 336 }];
  }
}
