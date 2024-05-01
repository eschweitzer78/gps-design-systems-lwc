import { LightningElement, api, track } from "lwc";

export default class extends LightningElement {
  @api label; // string
  @api description; // string
  @api required; // boolean

  _value;

  @api get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }

  @track error;

  handleBlur(event) {
    const value = event.target.value;
    this._value = value;

    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: {
          value
        }
      })
    );
  }
}
