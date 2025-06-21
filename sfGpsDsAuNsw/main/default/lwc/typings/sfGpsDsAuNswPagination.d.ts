
declare module "c/sfGpsDsAuNswPagination" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswPagination 
  extends SfGpsDsElement {
    ariaLabel: string;
    srOnlyPre: string;
    srOnlyPost?: string;
    srOnlyPrevious?: string;
    srOnlyNext: string;
    className?: string;

    lastPage?: number;
    activePage?: number;

    // private

    _lastPage: PropertyAccessor<number>;
    _activePage: PropertyAccessor<number>;

    get computedFirstPage(): number;
    get computedPrevPage(): number;
    get computedNextPage(): number;
    get computedShowPrevious(): boolean;
    get computedShowFirstPage(): boolean;
    get computedShowPrevEllipsis(): boolean;
    get computedShowPrevPage(): boolean;
    get computedShowActivePage(): boolean;
    get computedShowNextPage(): boolean;
    get computedShowNextEllipsis(): boolean;
    get computedShowLastPage(): boolean;
    get computedShowNext(): boolean;

    get computedClassName(): any;

    get computedPreviousDisabled(): boolean;
    get computedPrevPageClassName(): any;

    get computedNextDisabled(): boolean;
    get computedNextPageClassName(): any;

    handlePreviousPageClick(event: MouseEvent): void;
    handleFirstPageClick(event: MouseEvent): void;
    handleLastPageClick(event: MouseEvent): void;
    handleNextPageClick(event: MouseEvent): void;
  }
}
