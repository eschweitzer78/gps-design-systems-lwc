import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  ColumnDetails, 
  ReconciledRecordColumn 
} from "c/sfGpsDsAuNswListViewItem";

import type { 
  sObject,
  sObjectColumn
} from "c/sfGpsDsApex";
import type { 
  Link 
} from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswListViewItem";

export default 
class SfGpsDsAuNswListViewItem 
extends SfGpsDsElement {
  _displayColumns?: ColumnDetails[];

  // @ts-ignore
  @api 
  get displayColumns() {
    return this._displayColumns;
  }

  set displayColumns(value) {
    this._displayColumns = value;
    this.reconcile();
  }


  _record?: sObject;

  // @ts-ignore
  @api 
  get record() {
    return this._record;
  }
  
  set record(value) {
    this._record = value;
    this.reconcile();
  }


  // @ts-ignore
  @api 
  recordId?: string;

  // @ts-ignore
  @api 
  labelColumn?: string;

  // @ts-ignore
  @api 
  titleColumn?: string;

  // @ts-ignore
  @api 
  dateColumn?: string;

  // @ts-ignore
  @api 
  tagsColumn?: string;

  // @ts-ignore
  @api 
  imageColumn?: string;

  // @ts-ignore
  @api 
  imageAltColumn?: string;

  // @ts-ignore
  @api 
  link?: string;

  // @ts-ignore
  @track 
  _reconciledRecord? : ReconciledRecordColumn[];

  reconcile(): void {
    if (this._record && this._displayColumns) {
      if (DEBUG)
        console.debug(CLASS_NAME, "> reconcile",
          JSON.stringify(this._displayColumns),
          JSON.stringify(this._record)
        );
        
      this._reconciledRecord = this._displayColumns.map((column) => {
        let {
          value,
          displayValue,
          dataType,
          relationshipObjectApiName,
          relationshipId
        } = this.getColumnDetails(column.fieldApiName);
        let rv: ReconciledRecordColumn = {
          ...column,
          value: value,
          displayValue: displayValue || "",
          label: column.label,
          isBoolean: dataType === "BOOLEAN",
          isCurrency: dataType === "CURRENCY",
          isDate: dataType === "DATE",
          isDateTime: dataType === "DATETIME",
          isEmail: dataType === "EMAIL",
          isNumber: dataType ? ["INTEGER", "DOUBLE"].includes(dataType) : false,
          isPercent: dataType === "PERCENT",
          isPhone: dataType === "PHONE",
          isPicklist: dataType ? ["PICKLIST", "MULTIPICKLIST"].includes(dataType) : false,
          isReference: dataType === "REFERENCE",
          isString: dataType ? ["ENCRYPTEDSTRING", "ID", "STRING", null].includes(
            dataType
          ) : false,
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
              rv.relationshipId = relationshipId;
              rv.relationshipObjectApiName = relationshipObjectApiName;
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
      : undefined;
  }

  get _label() {
    if (!this.labelColumn) return undefined;
    return this.getColumnDetails(this.labelColumn).displayValue;
  }

  get _title() {
    if (!this.titleColumn) return undefined;
    return this.getColumnDetails(this.titleColumn).displayValue;
  }

  get _date(): string | undefined {
    if (!this.dateColumn) return undefined;

    return this.getColumnDetails(this.dateColumn).value;
  }

  get _tags(): Link[] | undefined {
    if (!this.tagsColumn) return undefined;

    let tags = this.getColumnDetails(this.tagsColumn).value;
    return tags
      ? (tags.toString() as string)
          .split(";")
          .map((value: string) => ({ text: value }))
      : undefined;
  }

  get _image(): string | undefined {
    if (!this.imageColumn) return undefined;

    return this.getColumnDetails(this.imageColumn).value;
  }

  get _imageAlt(): string | undefined {
    if (!this.imageAltColumn) return undefined;

    return this.getColumnDetails(this.imageAltColumn).displayValue;
  }

  get space(): string {
    return " ";
  }

  isUsedForMapping(
    fieldApiName: string
  ): boolean {
    return [
      this.labelColumn,
      this.titleColumn,
      this.dateColumn,
      this.tagsColumn,
      this.imageColumn,
      this.imageAltColumn
    ].some((name) => name === fieldApiName);
  }

  getColumnDetails(
    fieldApiName: string
  ): Partial<sObjectColumn> {
    if (!fieldApiName || !this._record) {
      return {
        displayValue: undefined,
        value: null,
        dataType: undefined,
        relationshipObjectApiName: undefined,
        relationshipId: undefined
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

  handleRelationshipNavigate(
    event: MouseEvent
  ): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          objectApiName: target.dataset.object,
          recordId: target.dataset.rid
        }
      })
    );
  }

  // eslint-disable-next-line no-unused-vars
  handleNavigate(
    _event: CustomEvent
  ): void {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          // leaving objectApiName for parent to apply
          recordId: this._record?.columns?.Id?.value
        }
      })
    );
  }
}
