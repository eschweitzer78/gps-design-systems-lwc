declare module "@salesforce/apex/SfGpsDsListViewController.getCount" {
  export default function getCount(options: {
    objectApiName: string,
    filterLogicString: string,
    filteredByInfo: string
  }): Promise<number>;
}