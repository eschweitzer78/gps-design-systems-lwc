

declare module "c/sfGpsDsAuNswListViewComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { 
    sObject 
  } from "c/sfGpsDsApex";
  import type {  
    ListViewInfo,
    ListColumn
  } from "lightning/uiListsApi";
  import { 
    SortOption 
  } from "c/sfGpsDsAuNswResultBar";
  import SfGpsDsNavigationService from "c/SfGpsDsNavigationService";

  export default 
  class SfGpsDsAuNswListViewComm
  extends SfGpsDsLwc {
    objectApiName?: string;
    pageSize: number;
    labelColumn?: string;
    titleColumn?: string;
    dateColumn?: string;
    tagsColumn?: string;
    imageColumn?: string;
    imageAltColumn?: string;
    className?: string;
    titleClassName?: string;

    get filterName(): string | undefined;
    set filterName(value: string);

    // private

    _isLoading: boolean;

    _filterName?: string;
    _filterNameOriginal: string;

    _listInfo?: ListViewInfo;
    _rawRecords?: sObject[];

    handleListInfo(result: { error: any, data: any }): void;
   
    _name?: string;
    _itemsTotal?: number;
    _pageSize: number;
    _lastPage?: number;
    _itemsFrom: number;
    _itemsTo?: number;
    _activePage: number;
    _sortValue?: string;
    _sortOptions?: SortOption[];
    _displayColumns?: ListColumn[];

    get navSvc(): SfGpsDsNavigationService;

    updateRecords(): void;
    updateVisibleRecords(): void;
    handlePageChange(event: CustomEvent): void;
    handleResultsBarChange(event: CustomEvent): void;  
    handleItemNavigate(event: CustomEvent): void; 
  }
}
