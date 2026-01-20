import { LightningElement, api } from "lwc";
import { isObject } from "c/sfGpsDsHelpers";

const ICON_DEFAULT_JSON = "{}";
const ICON_DEFAULT = {};

export default class extends LightningElement {
  @api label;
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }

  /* api: value */

  _value = ICON_DEFAULT;
  _valueOriginal = ICON_DEFAULT_JSON;

  @api
  get value() {
    return this._valueOriginal;
  }

  set value(value) {
    try {
      this._valueOriginal = value;
      const jsonValue = JSON.parse(value);

      if (isObject(jsonValue)) {
        this._value = jsonValue || ICON_DEFAULT;
      } else {
        this._value = ICON_DEFAULT;
      }
    } catch (e) {
      console.debug("set value exception", value, e);
      this._value = ICON_DEFAULT;
    }
  }

  /* computed */

  get name() {
    return this._value?.name;
  }

  get colour() {
    return this._value?.colour;
  }

  get size() {
    return this._value?.size;
  }

  get padded() {
    return this._value?.padded;
  }

  get title() {
    return this._value?.title;
  }

  /* methods */

  dispatchValueChange() {
    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: {
          value: JSON.stringify(this._value)
        }
      })
    );
  }

  /* event management */

  handleNameChange(event) {
    this._value = {
      ...this._value,
      name: event.detail.value
    };

    this.dispatchValueChange();
  }

  handleColourChange(event) {
    this._value = {
      ...this._value,
      colour: event.detail.value
    };

    this.dispatchValueChange();
  }

  handleSizeChange(event) {
    this._value = {
      ...this._value,
      size: event.detail.value
    };

    this.dispatchValueChange();
  }

  handlePaddedChange(event) {
    this._value = {
      ...this._value,
      padded: event.target.checked
    };

    this.dispatchValueChange();
  }

  handleTitleChange(event) {
    this._value = {
      ...this._value,
      title: event.target.value
    };

    this.dispatchValueChange();
  }
}
