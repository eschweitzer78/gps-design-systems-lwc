import { LightningElement, api, track } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const RplCardElements = ["div", "li"];
const EL_DEFAULT = "div";

const RplCardTypes = [
  "promo",
  "avatar",
  "nav",
  "call-to-action",
  "key-dates",
  "category-grid"
];
const TYPE_DEFAULT = "promo";

const HIGHLIGHT_DEFAULT = false;

export default class extends LightningElement {
  @api link;
  @api className;

  /* api: el */

  _el = EL_DEFAULT;
  _elOriginal = EL_DEFAULT;

  @api
  get el() {
    return this._elOriginal;
  }

  set el(value) {
    this._elOriginal = value;
    this._el = normaliseString(value, {
      validValues: RplCardElements,
      fallbackValue: EL_DEFAULT
    });
  }

  /* api: type */

  _type = TYPE_DEFAULT;
  _typeOriginal = TYPE_DEFAULT;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: RplCardTypes,
      fallbackValue: TYPE_DEFAULT
    });
  }

  /* api: highlight */

  _highlight = HIGHLIGHT_DEFAULT;
  _highlightOriginal = HIGHLIGHT_DEFAULT;

  @api
  get highlight() {
    return this._highlightOriginal;
  }

  set highlight(value) {
    this._highlightOriginal = value;
    this._highlight = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HIGHLIGHT_DEFAULT
    });
  }

  /* tracked */

  @track _hasMetaSlot;
  @track _hasUpperSlot;
  @track _hasLowerSlot;

  /* computed */

  get isDivEl() {
    return this._el === "div";
  }

  get computedClassName() {
    return {
      "rpl-card": true,
      "rpl-type-p": true,
      [`rpl-card--${this._type}`]: this._type,
      "rpl-card--link": this.link,
      [this.className]: this.className
    };
  }

  get computedUpperClassName() {
    return this._hasUpperSlot ? "rpl-card__upper" : null;
  }

  get computedMetaStyle() {
    return this._hasMetaSlot ? null : "display: none";
  }

  get computedUpperStyle() {
    return this._hasUpperSlot ? null : "display: none";
  }

  get computedLowerStyle() {
    return this._hasLowerSlot ? null : "display: none";
  }

  /* event management */

  handleSlotChange(event) {
    switch (event.target.name) {
      case "meta":
        this._hasMetaSlot = true;
        break;

      case "upper":
        this._hasUpperSlot = true;
        break;

      case "lower":
        this._hasLowerSlot = true;
        break;

      default:
    }
  }
}
