import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default 
class SfGpsDsAuNswPaginationComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  className: string;

  /* api: activePage, Integer */

  _currentActivePage: number;
  _activePage: number;

  // @ts-ignore
  @api 
  set activePage(value: number) {
    this._activePage = value;
    this._currentActivePage = Math.max(1, value);
  }

  get activePage(): number {
    return this._activePage;
  }

  /* api: lastPage, Integer */

  _currentLastPage: number;
  _lastPage: number;

  // @ts-ignore
  @api 
  set lastPage(value: number) {
    this._lastPage = value;
    this._currentLastPage = Math.max(1, value);

    if (this._currentActivePage > this._currentLastPage) {
      this._currentActivePage = this._currentLastPage;
    }
  }

  get lastPage(): number {
    return this._lastPage;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  /* events */

  handlePageChange(
    event: CustomEvent
  ): void {
    if (event.detail > 0 && event.detail <= this.lastPage) {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.activePage = event.detail;
    }
  }
}
