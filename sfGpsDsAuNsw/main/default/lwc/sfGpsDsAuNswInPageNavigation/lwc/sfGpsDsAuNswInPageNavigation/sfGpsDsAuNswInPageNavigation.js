import { LightningElement, api } from "lwc";
import { uniqueId, normaliseBoolean } from "c/sfGpsDsHelpers";

const FIRSTCHILD_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api items = []; // Array<{index, text, url}>
  @api className;

  /* api: firstChild */

  _firstChild = FIRSTCHILD_DEFAULT;
  _firstChildOriginal = FIRSTCHILD_DEFAULT;

  @api
  get firstChild() {
    return this._firstChildOriginal;
  }

  set firstChild(value) {
    this._firstChildOriginal = value;
    this._firstChild = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FIRSTCHILD_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-in-page-nav": true,
      [this.className]: this.className
    };
  }

  _labelledById;

  get computedAriaLabelledById() {
    if (this._labelledById === undefined) {
      this._labelledById = uniqueId("sf-gps-ds-au-nsw-in-page-nav-label");
    }

    return this._labelledById;
  }
}
