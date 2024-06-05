import { LightningElement, api } from "lwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api title;
  @api content;

  _headingLevelOriginal = 2;
  _headingLevel = 2;

  @api get headingLevel() {
    return this._headingLevelOriginal;
  }

  set headingLevel(value) {
    this._headingLevelOriginal = value;
    this._headingLevel = Number(value);
  }

  get isH3() {
    return this.headingLevel === 3;
  }

  get isH4() {
    return this.headingLebel === 4;
  }

  renderedCallback() {
    replaceInnerHtml(this.refs.content, this.content);
  }
}
