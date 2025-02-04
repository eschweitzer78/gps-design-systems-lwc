import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const CSTYLE_VALUES = {
  default: "",
  dark: "nsw-steps--dark",
  light: "nsw-steps--light",
  supplementary: "nsw-steps--supplementary"
};
const CSTYLE_DEFAULT = "default";
const FIRSTCHILD_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api type;
  @api className;

  /* api: firstChild */

  _firstChild = FIRSTCHILD_DEFAULT;
  _firstChildOriginal = FIRSTCHILD_DEFAULT;

  @api
  get firstChild() {
    return this._firstChildOriginal;
  }

  set firstChild(value) {
    this._firstChildOriginal = value;
    this._firstChild = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FIRSTCHILD_DEFAULT
    });
  }

  /* api: cstyle, Picklist */

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
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-steps": true,
      [this._cstyle]: this._cstyle,
      "nsw-steps--fill": this.type?.includes("fill"),
      "nsw-steps--counters": this.type?.includes("counter"),
      [this.className]: this.className
    };
  }
}
