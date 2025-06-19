declare module "c/sfGpsDsAuNswListViewComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswListViewComm
  extends SfGpsDsLwc {
    objectApiName: string;
    pageSize: number;
    labelColumn: string;
    titleColumn: string;
    dateColumn: string;
    tagsColumn: string;
    imageColumn: string;
    imageAltColumn: string;
    className: string;
    titleClassName: string;

    filterName: string;

    // private

    _isLoading: boolean;

    _filterName: string;
    _filterNameOriginal: string;
  }
}
