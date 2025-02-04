import { LightningElement, api, track } from "lwc";
import { isString } from "c/sfGpsDsHelpers";

/* Work in progress */

const HEADING_TYPE_DEFAULT = {
  horizontal: true,
  vertical: false
};

export default class extends LightningElement {
  @api caption = "";
  @api footer = "";
  @api columns;
  @api items;
  @api showExtraContent;
  @api offset = 1;
  @api className;

  /* api: headingType */

  _headingType = HEADING_TYPE_DEFAULT;
  _headingTypeOriginal = HEADING_TYPE_DEFAULT;

  @api
  get headingType() {
    return this._headingTypeOriginal;
  }

  set headingType(value) {
    this._headingTypeOriginal = value;

    if (isString(value)) {
      this._headingType = {
        horizontal: value.find("horizontal") >= 0,
        vertical: value.find("vertical") >= 0
      };
    } else {
      this._headingType = value;
    }

    this.hasVerticalHeader = this._headingType?.vertical === true;
  }

  @track hasVerticalHeader = false;

  /* computed */

  get computedShowHead() {
    return this._headingType.horizontal && this.columns?.length > 0;
  }

  get computedColumnsLength() {
    return this.columns?.length;
  }

  get computedColumns() {
    return this.columns || [];
  }

  get computedItems() {
    return this.items || [];
  }

  get computedHasVerticalHeader() {
    return false;
  }
}
