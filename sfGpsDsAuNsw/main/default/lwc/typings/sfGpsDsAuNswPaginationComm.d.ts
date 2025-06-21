
declare module "c/sfGpsDsAuNswPaginationComm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswPaginationComm 
  extends SfGpsDsLwc {
    className?: string;

    get activePage(): number | undefined;
    set activePage(value: number);
    get lastPage(): number | undefined;
    set lastPage(value: number);

    // private

    _currentActivePage?: number;
    _activePage?: number;
    _currentLastPage?: number;
    _lastPage?: number;

    handlePageChange(
      event: CustomEvent
    ): void;
  }
}
