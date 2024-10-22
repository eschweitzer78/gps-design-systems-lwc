import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const DIRECTION_DOWN = "down";
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";
const DIRECTION_UP = "up";
const DIRECTION_VALUES = [
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP
];
const DIRECTION_DEFAULT = DIRECTION_RIGHT;

export default class extends LightningElement {
  @api label;
  @api url;
  @api className;

  /* api: direction */

  _direction;
  _directionOriginal;

  @api get direction() {
    return this._directionOriginal;
  }

  set direction(value) {
    this._directionOriginal = value;
    this._direction = normaliseString(value, {
      validValues: DIRECTION_VALUES,
      fallbackValue: DIRECTION_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return computeClass({
      "qld__direction-link": true,
      "qld__direction-link--down": this._direction === DIRECTION_DOWN,
      "qld__direction-link--left": this._direction === DIRECTION_LEFT,
      "qld__direction-link--right": this._direction === DIRECTION_RIGHT,
      "qld__direction-link--up": this._direction === DIRECTION_UP,
      [this.className]: this.className
    });
  }
}
