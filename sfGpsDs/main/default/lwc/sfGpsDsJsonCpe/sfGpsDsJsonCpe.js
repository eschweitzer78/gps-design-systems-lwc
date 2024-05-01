import { LightningElement, api } from "lwc";
import editor from "c/sfGpsDsJsonEditor";

export default class extends LightningElement {
  @api label; // string
  @api description; // string
  @api required; // boolean

  _valueOriginal;

  @api get value() {
    return this._valueOriginal;
  }

  set value(value) {
    this._valueOriginal = value;
  }

  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }

  handleClick() {
    editor
      .open({
        label: "JSON Editor",
        title: "JSON Editor",
        tips: "Add and edit JSON.",
        text: this._valueOriginal,
        size: "large",
        description: "Text editor to edit JSON."
      })
      .then((result) => {
        if (result == null) return;

        this._valueOriginal = result;

        this.dispatchEvent(
          new CustomEvent("valuechange", {
            detail: {
              value: result
            }
          })
        );
      });
  }
}
