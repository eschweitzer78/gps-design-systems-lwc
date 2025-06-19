declare module "@salesforce/apex/SfGpsDsListViewController.getEnhancedRecords" {

  interface GetEnhancecRecordsOptions {
    objectApiName: string,
    displayColumns: string,
    filterLogicString: string,
    filteredByInfo: string,
    orderedByInfo: string,
    offset: number,
    pageSize: number
  }

  interface EnhancedRecordColumn {
    fieldApiName: string,
    dataType: string,
    value: any,
    displayValue: string,
    relationshipObjectApiName: string,
    relationshipId: string
  }
  interface EnhancedRecord {
    columns: Record<string, EnhancedRecordColumn>
  }

  export default function getEnhancedRecords(
    options: GetEnhancecRecordsOptions
  ): Promise<EnhancedRecord[]>;
}