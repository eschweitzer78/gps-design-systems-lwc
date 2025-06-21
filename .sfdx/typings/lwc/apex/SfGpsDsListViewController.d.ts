declare module "@salesforce/apex/SfGpsDsListViewController.getListViewNameById" {
  export default function getListViewNameById(param: {id: any}): Promise<any>;
}
declare module "@salesforce/apex/SfGpsDsListViewController.getCount" {
  export default function getCount(param: {objectApiName: any, filterLogicString: any, filteredByInfo: any}): Promise<any>;
}
declare module "@salesforce/apex/SfGpsDsListViewController.getRecords" {
  export default function getRecords(param: {objectApiName: any, displayColumns: any, filterLogicString: any, filteredByInfo: any, orderedByInfo: any, offset: any, pageSize: any}): Promise<any>;
}
declare module "@salesforce/apex/SfGpsDsListViewController.getEnhancedRecords" {
  export default function getEnhancedRecords(param: {objectApiName: any, displayColumns: any, filterLogicString: any, filteredByInfo: any, orderedByInfo: any, offset: any, pageSize: any}): Promise<any>;
}
