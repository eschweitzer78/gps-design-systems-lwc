import { LightningElement, api } from "lwc";
import { replaceInnerHtml, normaliseInteger } from "c/sfGpsDsHelpers";

const HEADINGLEVEL_DEFAULT = 2;

export default class extends LightningElement {
  @api title;
  @api content;

  /* api: headingLevel */

  _headingLevel = HEADINGLEVEL_DEFAULT;
  _headingLevelOriginal = HEADINGLEVEL_DEFAULT;

  @api
  get headingLevel() {
    return this._headingLevelOriginal;
  }

  set headingLevel(value) {
    this._headingLevelOriginal = value;
    this._headingLevel = normaliseInteger(value, {
      acceptString: true,
      minValue: 2,
      maxValue: 4,
      fallbackValue: HEADINGLEVEL_DEFAULT
    });
  }

  get _isH3() {
    return this._headingLevel === 3;
  }

  get _isH4() {
    return this._headingLebel === 4;
  }

  renderedCallback() {
    replaceInnerHtml(this.refs.content, this.content);
  }
}
