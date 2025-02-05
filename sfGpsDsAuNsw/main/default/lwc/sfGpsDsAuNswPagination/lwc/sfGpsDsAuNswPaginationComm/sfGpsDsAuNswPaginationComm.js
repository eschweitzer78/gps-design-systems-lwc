import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api className;

  /* api: activePage, Integer */

  _currentActivePage;
  _activePage;

  @api set activePage(value) {
    this._activePage = value;
    this._currentActivePage = Math.max(1, value);
  }

  get activePage() {
    return this._activePage;
  }

  /* api: lastPage, Integer */

  _currentLastPage;
  _lastPage;

  @api set lastPage(value) {
    this._lastPage = value;
    this._currentLastPage = Math.max(1, value);

    if (this._currentActivePage > this._currentLastPage) {
      this._currentActivePage = this._currentLastPage;
    }
  }

  get lastPage() {
    return this._lastPage;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  /* events */

  handlePageChange(event) {
    if (event.detail > 0 && event.detail <= this.lastPage) {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.activePage = event.detail;
    }
  }
}
