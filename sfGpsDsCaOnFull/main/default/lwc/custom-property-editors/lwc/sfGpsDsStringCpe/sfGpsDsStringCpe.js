import { LightningElement, api, track } from "lwc";

export default class extends LightningElement {
  @api label; // string
  @api description; // string
  @api required; // boolean
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }

  /* api: value */

  _value;

  @api
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  /* track */

  @track error;

  /* event management */

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
