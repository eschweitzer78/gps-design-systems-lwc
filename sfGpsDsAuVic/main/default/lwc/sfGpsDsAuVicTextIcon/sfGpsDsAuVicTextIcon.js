import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseString, isString } from "c/sfGpsDsHelpers";

const PLACEMENT_AFTER = "after";
const PLACEMENT_BEFORE = "before";
const PLACEMENT_DEFAULT = PLACEMENT_AFTER;
const PLACEMENT_VALUES = [PLACEMENT_AFTER, PLACEMENT_BEFORE];

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api symbol;
  @api color = "primary";
  @api size = "m";

  /* api: placement */

  _placement = PLACEMENT_DEFAULT;
  _placementOriginal = PLACEMENT_DEFAULT;

  @api
  get placement() {
    return this._placementOriginal;
  }

  set placement(value) {
    this._placementOriginal = value;
    this._placement = normaliseString(value, {
      validValues: PLACEMENT_VALUES,
      fallbackValue: PLACEMENT_DEFAULT
    });
  }

  /* api: text */

  _text;
  _textArray;
  _textWordCount;

  @api
  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
    this._textArray = isString(value) ? value.trim().split(" ") : [];
    this._textWordCount = this._textArray.length;
  }

  /* computed */

  get computedShowBefore() {
    return this._text && this.symbol && this._placement === PLACEMENT_BEFORE;
  }

  get computedShowAfter() {
    return this._text && this.symbol && this._placement === PLACEMENT_AFTER;
  }

  get computedHasMultipleWords() {
    return this._textWordCount > 1;
  }

  get computedTextWithoutLastWord() {
    return this._textArray.slice(0, this._textWordCount - 1).join(" ");
  }

  get computedTextLastWord() {
    return this._textArray[this._textWordCount - 1];
  }

  get computedTextWithoutFirstWord() {
    return this._textArray.slice(1).join(" ");
  }

  get computedTextFirstWord() {
    return this._textArray[0];
  }

  get computedIconClassName() {
    return {
      "rpl-text-icon--after": this._placement === PLACEMENT_AFTER,
      "rpl-text-icon--before": this._placement === PLACEMENT_BEFORE
    };
  }

  get space() {
    return " ";
  }
}
