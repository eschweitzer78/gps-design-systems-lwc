declare module "c/sfGpsDsAuNswTableComm" { 
  import type SfGpsDsIpLwc from "c/sfGpsDsIpLwc"; 
  import type { CaptionLocation, Header } from "c/sfGpsDsAuNswTable";
  import type { SortOption } from "c/sfGpsDsAuNswResultBar";

  export default 
  class SfGpsDsAuNswTableComm 
  extends SfGpsDsIpLwc {
    resultsBarStyle: string;
    caption?: string;
    captionLocation?: CaptionLocation;
    isStriped: boolean;
    sBordered: boolean;
    pageSize: number;
    className?: string;

    get sortHeader(): string | undefined;
    set sortHeader(value: string);

    get headers(): string | undefined;
    set headers(value: string);

    // private

    _sortHeader?: string;
    _headersOriginal?: string;
    _headers?: Header[];
    _totalRows: number;
    _activePage: number;
    _lastPage: number;
    _offset: number;
    _content?: object[];
    _sortOptions?: SortOption[];

    get computedFrom(): number;
    get computedTo(): number;
    get computedVisibleSortOptions(): SortOption[] | undefined;
    get computedShowResultsBar(): boolean;

    computeSortOptions(): void;

    mapIpData(
      data: object | object[]
    ): any;

    sortContent(
      sortHeader?: string | undefined
    ): void;

    handlePageChange(event: CustomEvent): void;
    handleSortChange(event: CustomEvent): void;
  }
}
