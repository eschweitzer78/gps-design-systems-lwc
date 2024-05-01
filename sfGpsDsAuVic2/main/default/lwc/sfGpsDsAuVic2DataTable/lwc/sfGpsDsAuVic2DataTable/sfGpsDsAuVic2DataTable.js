import { LightningElement, api, track } from "lwc";

/* Work in progress */

const HEADING_TYPE_DEFAULT = {
  horizontal: true,
  vertical: false
};

export default class SfGpsDsAuVic2DataTable extends LightningElement {
  @api caption = "";
  @api footer = "";
  @api columns;
  @api items;
  @api showExtraContent;

  /* api: headingType */

  _headingTypeOriginal = HEADING_TYPE_DEFAULT;
  _headingType = HEADING_TYPE_DEFAULT;

  @api get headingType() {
    return this._headingTypeOriginal;
  }

  set headingType(value) {
    this._headingTypeOriginal = value;

    if (typeof value === "string") {
      this._headingType = {
        horizontal: value.find("horizontal") >= 0,
        vertical: value.find("vertical") >= 0
      };
    } else {
      this._headingType = value;
    }

    this.hasVerticalHeader = this._headingType?.vertical === true;
  }

  @api offset = 1;
  @api className;

  @track hasVerticalHeader = false;

  /* computed */

  get computedShowHead() {
    return this._headingType.horizontal && this.columns?.length > 0;
  }

  get computedColumnsLength() {
    return this.columns?.length;
  }

  get computedColumns() {
    return [];
  }

  get computedItems() {
    return [];
  }

  get computedHasVerticalHeader() {
    return false;
  }
}
