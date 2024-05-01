import { LightningElement, api, track } from "lwc";

const ICON_DEFAULT_JSON = "{}";
const ICON_DEFAULT = {};

export default class extends LightningElement {
  @api label;
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }

  /* api: value */

  _valueOriginal = ICON_DEFAULT_JSON;
  @track _value = ICON_DEFAULT;

  @api get value() {
    return this._valueOriginal;
  }

  set value(value) {
    this._valueOriginal = value;

    try {
      const jsonValue = JSON.parse(value);

      if (typeof jsonValue === "object") {
        this._value = jsonValue || ICON_DEFAULT;
      } else {
        this._value = ICON_DEFAULT;
      }
    } catch (e) {
      console.log("set value exception", value, e);
      this._value = ICON_DEFAULT;
    }
  }

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

  handleNameChange(event) {
    console.log("> handleNameChange", JSON.stringify(this._value));
    this._value = {
      ...this._value,
      name: event.detail.value
    };

    console.log("< handleNameChange", JSON.stringify(this._value));
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
    /* eslint-disable-next-line @lwc/lwc/no-api-reassignments */
    this._value = {
      ...this._value,
      size: event.detail.value
    };

    this.dispatchValueChange();
  }

  handlePaddedChange(event) {
    /* eslint-disable-next-line @lwc/lwc/no-api-reassignments */
    this._value = {
      ...this._value,
      padded: event.target.checked
    };

    this.dispatchValueChange();
  }

  handleTitleChange(event) {
    /* eslint-disable-next-line @lwc/lwc/no-api-reassignments */
    this._value = {
      ...this._value,
      title: event.target.value
    };

    this.dispatchValueChange();
  }

  dispatchValueChange() {
    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: {
          value: JSON.stringify(this._value)
        }
      })
    );
  }
}
