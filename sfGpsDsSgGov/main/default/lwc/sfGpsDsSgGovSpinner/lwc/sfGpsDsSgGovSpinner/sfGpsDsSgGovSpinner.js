import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const TYPE_DEFAULT = "border";
const TYPE_VALUES = {
  border: "spinner-border",
  grow: "spinner-grow"
};

const COLOR_PRIMARY = "primary";
const COLOR_SECONDARY = "secondary";
const COLOR_SUCCESS = "success";
const COLOR_DANGER = "danger";
const COLOR_WARNING = "warning";
const COLOR_INFO = "info";
const COLOR_LIGHT = "light";
const COLOR_DARK = "dark";
const COLOR_VALUES = [
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_SUCCESS,
  COLOR_DANGER,
  COLOR_WARNING,
  COLOR_INFO,
  COLOR_LIGHT,
  COLOR_DARK
];
const COLOR_DEFAULT = COLOR_PRIMARY;

export default class extends LightningElement {
  @api label = "Loading...";
  @api className;

  /* api: type */

  _type = TYPE_VALUES[TYPE_DEFAULT];
  _typeOriginal = TYPE_DEFAULT;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: color */

  _color = COLOR_DEFAULT;
  _colorOriginal = COLOR_DEFAULT;

  @api
  get color() {
    return this._colorOriginal;
  }

  set color(value) {
    this._colorOriginal = value;
    this._color = normaliseString(value, {
      validValues: COLOR_VALUES,
      fallbackValue: COLOR_DEFAULT
    });

    this.setAttribute("color", this._color);
  }

  /* getters */

  get computedClassName() {
    return {
      spinner: true,
      [this._type]: this._type,
      [this.className]: this.className
    };
  }
}
