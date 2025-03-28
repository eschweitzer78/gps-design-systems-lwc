import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const TYPE_DEFAULT = "info";
const TYPE_VALUES = {
  error: "qld__page-alerts--error",
  info: "qld__page-alerts--info",
  success: "qld__page-alerts--success",
  warning: "qld__page-alerts--warning"
};

export default class extends LightningElement {
  @api heading;
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

  /* getters */

  get computedClassName() {
    return {
      "qld__page-alerts": true,
      [this._type]: this._type,
      [this.className]: this.className
    };
  }
}
