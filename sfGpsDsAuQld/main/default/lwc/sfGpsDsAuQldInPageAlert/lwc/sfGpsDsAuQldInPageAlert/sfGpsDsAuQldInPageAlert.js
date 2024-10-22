import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const TYPE_INFO = "info";
const TYPE_SUCCESS = "success";
const TYPE_WARNING = "warning";
const TYPE_ERROR = "error";
const TYPE_VALUES = [TYPE_INFO, TYPE_SUCCESS, TYPE_WARNING, TYPE_ERROR];
const TYPE_DEFAULT = TYPE_INFO;

export default class extends LightningElement {
  @api title;
  @api className;

  /* api: type */

  _type;
  _typeOriginal;

  @api get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return computeClass({
      "qld__page-alerts": true,
      "qld__page-alerts--error": this._type === TYPE_ERROR,
      "qld__page-alerts--info": this._type === TYPE_INFO,
      "qld__page-alerts--success": this._type === TYPE_SUCCESS,
      "qld__page-alerts--warning": this._type === TYPE_WARNING,
      [this.className]: this.className
    });
  }
}
