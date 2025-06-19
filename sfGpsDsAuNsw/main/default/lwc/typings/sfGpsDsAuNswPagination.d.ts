
declare module "c/sfGpsDsAuNswPagination" { 
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswPagination 
  extends SfGpsDsElement {
    ariaLabel: string;
    srOnlyPre: string;
    srOnlyPost: string;
    srOnlyPrevious: string;
    srOnlyNext: string;
    className: string;

    lastPage: number;
    activePage: number;

    // private
    _lastPage: PropertyAccessor<number>;
    _activePage: PropertyAccessor<number>;

    readonly computedFirstPage: number;
    readonly computedPrevPage: number;
    readonly computedNextPage: number;
    readonly computedShowPrevious: boolean;
    readonly computedShowFirstPage: boolean;
    readonly computedShowPrevEllipsis: boolean;
    readonly computedShowPrevPage: boolean;
    readonly computedShowActivePage: boolean;
    readonly computedShowNextPage: boolean;
    readonly computedShowNextEllipsis: boolean;
    readonly computedShowLastPage: boolean;
    readonly computedShowNext: boolean;

    readonly computedClassName: any;

    readonly computedPreviousDisabled: boolean;
    readonly computedPrevPageClassName: any;

    readonly computedNextDisabled: boolean;
    readonly computedNextPageClassName: any;

    handlePreviousPageClick(event: MouseEvent): void;
    handleFirstPageClick(event: MouseEvent): void;
    handleLastPageClick(event: MouseEvent): void;
    handleNextPageClick(event: MouseEvent): void;
  }
}
