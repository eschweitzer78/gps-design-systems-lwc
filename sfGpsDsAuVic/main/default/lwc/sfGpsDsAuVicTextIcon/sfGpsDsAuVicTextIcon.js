import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicTextIcon extends SfGpsDsLwc {
  static renderMode = "light";

  @api symbol;
  @api color = "primary";
  @api placement = "after";
  @api size = "m";

  _text;
  @api get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
    this.textArray = this.trimmedText.split(" ");
    this.textWordCount = this.textArray.length;
  }

  @track textArray;
  @track textWordCount;

  get showBefore() {
    return this.text && this.symbol && this.placement === "before";
  }

  get showAfter() {
    return this.text && this.symbol && this.placement === "after";
  }

  get showOtherwise() {
    return (
      !this.symbol ||
      (this.placement !== "before" && this.placement !== "after")
    );
  }

  get hasMultipleWords() {
    return this.textWordCount > 1;
  }

  get trimmedText() {
    return this.text ? this.text.trim() : "";
  }

  get textWithoutLastWord() {
    return this.textArray.slice(0, this.textWordCount - 1).join(" ");
  }

  get textLastWord() {
    return this.textArray[this.textWordCount - 1];
  }

  get textWithoutFirstWord() {
    return this.textArray.slice(1).join(" ");
  }

  get textFirstWord() {
    return this.textArray[0];
  }

  get computedIconClass() {
    return `rpl-text-icon--${this.placement}`;
  }

  get space() {
    return " ";
  }
}
