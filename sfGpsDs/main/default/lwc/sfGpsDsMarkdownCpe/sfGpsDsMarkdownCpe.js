import { LightningElement, api } from "lwc";
import markupEditor from "c/sfGpsDsMarkupEditor";

export default class sfGpsDsMarkdownCpe extends LightningElement {
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
    markupEditor
      .open({
        label: "Markdown Editor",
        title: "Markdown Editor",
        tips: "Add and edit markdown.",
        markup: this._valueOriginal,
        mode: "markdown",
        size: "large",
        description: "Text editor to edit custom Markdown."
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
