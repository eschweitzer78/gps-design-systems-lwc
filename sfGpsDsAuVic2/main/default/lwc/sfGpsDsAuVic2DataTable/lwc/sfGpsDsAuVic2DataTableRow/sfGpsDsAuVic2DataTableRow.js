import { LightningElement, api, track } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const VERTICAL_HEADER_DEFAULT = true;

export default class extends LightningElement {
  @api content = "";
  @api columns;
  @api items;
  @api row;
  @api extraContent;
  @api offset;
  @api caption;

  @api index;
  @api className;

  @track enabled = false;

  /* api: verticalHeader */

  _verticalHeader = VERTICAL_HEADER_DEFAULT;
  _verticalHeaderOriginal = VERTICAL_HEADER_DEFAULT;

  @api
  get verticalHeader() {
    return this._verticalHeaderOriginal;
  }

  set verticalHeader(value) {
    this._verticalHeaderOriginal = value;
    this._verticalHeader = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: true
    });
  }

  /* computed */

  get computedClassName() {
    if (this.columns) {
      return {
        "rpl-data-table__row": true,
        "rpl-data-table__row--open": this.state?.enabled,
        [this.columns[this.index]?.classes]:
          this.index >= 0 && this.index < this.columns?.length
      };
    }

    return {
      "rpl-data-table__row": true,
      "rpl-data-table__row--open": this.state?.enabled
    };
  }

  get computedToggleLabel() {
    return this.enabled ? "Less info" : "More info";
  }

  get computedIconName() {
    return this.enabled ? "icon-chevron-up" : "icon-chevron-down";
  }

  get computedOffsetRemainder() {
    const cLength = this.columns ? this.columns.length : 0;
    const offset = this.offset ? this.offset : 0;
    return cLength + 1 - offset;
  }

  get decoratedColumns() {
    return this.columns.map((column, index) => ({
      ...column,
      _key: `column-{$index + 1}`,
      _isHeader: index === 0 && column.verticalHeader,
      _cellText: this.getCellText(index)
    }));
  }

  /* methods */

  hasComponent(column) {
    /* eslint-disable-next-line no-prototype-builtins */
    return typeof column === "object" && column.hasOwnProperty("component");
  }

  getCellText(colIndex) {
    const column = this.columns[colIndex];
    const objectKey = column.objectKey;

    /* eslint-disable-next-line no-prototype-builtins */
    return typeof this.row === "object" && this.row.hasOwnProperty(objectKey)
      ? this.row[objectKey]
      : "";
  }
  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("expandRow", {
        detail: {
          action: !this.enabled ? "open" : "close",
          text: this.computedToggleLabel,
          label: this.getCellText(0),
          name: this.caption,
          index: this.index + 1
        }
      })
    );

    this.enabled = !this.enabled;
  }
}
