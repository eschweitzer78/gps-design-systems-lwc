

declare module "c/sfGpsDsAuNswListViewItem" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
  import type { 
    sObject, 
    sObjectColumn
  } from "c/sfGpsDsApex";

  export interface ColumnDetails extends sObjectColumn {
    link?: string,
    label: string
  }

  export interface ReconciledRecordColumn extends ColumnDetails {
    value: any,
    displayValue: string,
    label: string,
    link?: string,
    isBoolean: boolean,
    isCurrency: boolean,
    isDate: boolean,
    isDateTime: boolean,
    isEmail: boolean,
    isNumber: boolean,
    isPercent: boolean,
    isPhone: boolean,
    isPicklist: boolean,
    isReference: boolean,
    isString: boolean,
    isTextArea: boolean,
    isTime: boolean,
    isURL: boolean
  }

  export default 
    class SfGpsDsAuNswListViewItem
    extends SfGpsDsElement {

    get displayColumns(): ColumnDetails[] | undefined;
    set displayColumns(columns: ColumnDetails[]);

    get record(): sObject | undefined;
    set record(value: sObject);

    recordId?: string;
    labelColumn?: string;
    titleColumn?: string;
    dateColumn?: string;
    tagsColumn?: string;
    imageColumn?: string;
    imageAltColumn?: string;
    link?: string;

    // private

    _displayColumns?: ColumnDetails[];
    _record?: sObject;

    _reconciledRecord? : ReconciledRecordColumn[];

    reconcile(): void;

    get _filteredRecord(): ReconciledRecordColumn[] | undefined;

    get _label(): string | undefined;
    get _title(): string | undefined;
    get _date(): string | undefined;
    get _tags(): Link[] | undefined;
    get _image(): string | undefined;
    get _imageAlt(): string | undefined;

    get space(): string;

    isUsedForMapping(
      fieldApiName: string
    ): boolean;

    getColumnDetails(
      fieldApiName: string
    ): Partial<sObjectColumn>;

    handleRelationshipNavigate(
      event: MouseEvent
    ): void;

    handleNavigate(
      event: CustomEvent
    ): void;
 
  }
}
