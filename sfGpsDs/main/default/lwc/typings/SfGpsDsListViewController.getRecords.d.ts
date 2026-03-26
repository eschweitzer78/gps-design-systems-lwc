declare module "@salesforce/apex/SfGpsDsListViewController.getRecords" {
  import type { sObject, SoqlOperator } from "c/sfGpsDsApex";

  interface ListColumn {
    fieldApiName: string,
    label: string,
    sortable: boolean
  }

  interface ListFilteredByInfo {
    fieldApiName: string,
    label: string,
    operandLabels: string[],
    operator: SoqlOperator
  }

  interface ListOrderedByInfo {
    fieldApiName: string,
    isAscending: boolean,
    label: string
  }

  interface GetRecordsOptions {
    objectApiName: string,
    xdisplayColumns: Array<ListColumn>,
    filterLogicString: string,
    xfilteredByInfo: ListFilteredByInfo[],
    xorderedByInfo: ListOrderedByInfo[],
    offset: number,
    pageSize: number
  }

  export default function getRecords(
    options: GetRecordsOptions
  ): Promise<sObject[]>;
}