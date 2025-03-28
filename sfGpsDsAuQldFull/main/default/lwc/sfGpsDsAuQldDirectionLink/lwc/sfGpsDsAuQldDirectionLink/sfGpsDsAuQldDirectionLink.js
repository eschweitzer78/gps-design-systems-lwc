import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const DIRECTION_DEFAULT = "right";
const DIRECTION_VALUES = {
  down: "qld__direction-link--down",
  left: "qld__direction-link--left",
  right: "qld__direction-link--right",
  up: "qld__direction-link--up"
};

export default class extends LightningElement {
  @api label;
  @api url;
  @api className;

  /* api: direction */

  _direction = DIRECTION_VALUES[DIRECTION_DEFAULT];
  _directionOriginal = DIRECTION_DEFAULT;

  @api
  get direction() {
    return this._directionOriginal;
  }

  set direction(value) {
    this._directionOriginal = value;
    this._direction = normaliseString(value, {
      validValues: DIRECTION_VALUES,
      fallbackValue: DIRECTION_DEFAULT,
      returnObjectValue: true
    });
  }

  /* getters */

  get computedClassName() {
    return {
      "qld__direction-link": true,
      [this._direction]: this._direction,
      [this.className]: this.className
    };
  }
}
