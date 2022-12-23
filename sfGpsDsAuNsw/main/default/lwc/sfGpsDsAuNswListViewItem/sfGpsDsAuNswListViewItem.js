import { LightningElement, api, track } from "lwc";

export default class SfGpsDsAuNswListViewItem extends LightningElement {
  _displayColumns;

  @api set displayColumns(value) {
    this._displayColumns = value;
    this.reconcile();
  }

  get displayColumns() {
    return this._displayColumns;
  }

  _record;

  @api set record(value) {
    this._record = value;
    this.reconcile();
  }

  get record() {
    return this._record;
  }

  @api labelColumn;
  @api titleColumn;
  @api dateColumn;
  @api tagsColumn;
  @api imageColumn;
  @api imageAltColumn;
  @api link;

  @track _reconciledRecord;

  reconcile() {
    if (this._record && this._displayColumns) {
      console.log(
        "reconcile",
        JSON.stringify(this._displayColumns),
        JSON.stringify(this._record)
      );
      this._reconciledRecord = this._displayColumns.map((column) => {
        let { value, displayValue, dataType, relationshipId } =
          this.getColumnDetails(column.fieldApiName);
        let rv = {
          ...column,
          value: value,
          displayValue: displayValue,
          label: column.label,
          isBoolean: dataType === "BOOLEAN",
          isCurrency: dataType === "CURRENCY",
          isDate: dataType === "DATE",
          isDateTime: dataType === "DATETIME",
          isEmail: dataType === "EMAIL",
          isNumber: ["INTEGER", "DOUBLE"].includes(dataType),
          isPercent: dataType === "PERCENT",
          isPhone: dataType === "PHONE",
          isPicklist: ["PICKLIST", "MULTIPICKLIST"].includes(dataType),
          isReference: dataType === "REFERENCE",
          isString: ["ENCRYPTEDSTRING", "ID", "STRING", null].includes(
            dataType
          ),
          isTextArea: dataType === "TEXTAREA",
          isTime: dataType === "TIME",
          isURL: dataType === "URL"
        };

        switch (dataType) {
          case "EMAIL":
            rv.link = `mailto:${value}`;
            break;

          case "PHONE":
            rv.link = `tel:${value}`;
            break;

          case "URL":
            rv.link = value;
            break;

          case "STRING":
            if (relationshipId) {
              rv.link = `#${relationshipId}`;
            }
            break;

          default:
            break;
        }

        return rv;
      });
    }
  }

  /* returns only the reconciledRecord columns NOT used for mapping to the list item attributes */

  get _filteredRecord() {
    return this._reconciledRecord
      ? this._reconciledRecord.filter(
          (column) => !this.isUsedForMapping(column.fieldApiName)
        )
      : null;
  }

  get _label() {
    return this.getColumnDetails(this.labelColumn).displayValue;
  }

  get _title() {
    return this.getColumnDetails(this.titleColumn).displayValue;
  }

  get _date() {
    return this.getColumnDetails(this.dateColumn).value;
  }

  get _tags() {
    let tags = this.getColumnDetails(this.tagsColumn).value;
    return tags
      ? tags
          .toString()
          .split(";")
          .map((value) => ({ text: value }))
      : null;
  }

  get _image() {
    return this.getColumnDetails(this.imageColumn).value;
  }

  get _imageAlt() {
    return this.getColumnDetails(this.imageAltColumn).displayValue;
  }

  isUsedForMapping(fieldApiName) {
    return [
      this.labelColumn,
      this.titleColumn,
      this.dateColumn,
      this.tagsColumn,
      this.imageColumn,
      this.imageAltColumn
    ].some((name) => name === fieldApiName);
  }

  getColumnDetails(fieldApiName) {
    if (!fieldApiName) {
      return {
        displayValue: null,
        value: null,
        dataType: null,
        relationshipObjectApiName: null,
        relationshipId: null
      };
    }

    let field = this._record.columns[fieldApiName];
    return {
      displayValue: field?.displayValue || field?.value,
      value: field?.value,
      dataType: field?.dataType,
      relationshipObjectApiName: field?.relationshipObjectApiName,
      relationshipId: field?.relationshipId
    };
  }

  handleNavigate() {
    this.dispatchEvent(
      new CustomEvent("navigate", { detail: this._record?.columns?.Id?.value })
    );
  }
}
