import { LightningElement, api } from "lwc";
import { normaliseInteger } from "c/sfGpsDsHelpers";

const ACTIVEPAGE_DEFAULT = 1;
const LASTPAGE_DEFAULT = 1;

export default class extends LightningElement {
  static renderMode = "light";

  @api ariaLabel = "Pagination";
  @api srOnlyPre = "Page ";
  @api srOnlyPost;
  @api srOnlyPrevious = "Previous";
  @api srOnlyNext = "Next";

  @api className;

  /* api: lastPage, Integer */

  _lastPage = LASTPAGE_DEFAULT;
  _lastPageOriginal = LASTPAGE_DEFAULT;

  @api
  get lastPage() {
    return this._lastPageOriginal;
  }

  set lastPage(value) {
    this._lastPageOriginal = value;
    this._lastPage = normaliseInteger(value, {
      acceptString: true,
      fallbackValue: LASTPAGE_DEFAULT
    });
  }

  /* api: activePage, Integer */

  _activePage = ACTIVEPAGE_DEFAULT;
  _activePageOriginal = ACTIVEPAGE_DEFAULT;

  @api
  get activePage() {
    return this._activePageOriginal;
  }

  set activePage(value) {
    this._activePageOriginal = value;
    this._activePage = normaliseInteger(value, {
      acceptString: true,
      fallbackValue: ACTIVEPAGE_DEFAULT
    });
  }

  /* computed */

  get computedFirstPage() {
    return 1;
  }

  get computedPrevPage() {
    return this._activePage - 1;
  }

  get computedNextPage() {
    return this._activePage + 1;
  }

  get computedShowPrevious() {
    return this._activePage > 1;
  }

  get computedShowFirstPage() {
    return this._activePage > 2;
  }

  get computedShowPrevEllipsis() {
    return this._activePage > 3;
  }

  get computedShowPrevPage() {
    return this._activePage > 1;
  }

  get computedShowActivePage() {
    return this._lastPage > 0;
  }

  get computedShowNextPage() {
    return this._activePage < this._lastPage;
  }

  get computedShowNextEllipsis() {
    return this._activePage < this._lastPage - 2;
  }

  get computedShowLastPage() {
    return this._activePage < this._lastPage - 1;
  }

  get computedShowNext() {
    return this._activePage < this._lastPage;
  }

  get computedClassName() {
    return {
      "nsw-pagination": true,
      [this.className]: this.className
    };
  }

  get computedPreviousDisabled() {
    return !this.computedShowPrevious;
  }

  get computedPrevPageClassName() {
    return {
      "nsw-icon-button": true,
      disabled: this.computedPreviousDisabled
    };
  }

  get computedNextDisabled() {
    return !this.computedShowNext;
  }

  get computedNextPageClassName() {
    return {
      "nsw-icon-button": true,
      disabled: this.computedNextDisabled
    };
  }

  /* event management */

  handlePreviousPageClick(event) {
    event.preventDefault();
    if (this._activePage > 1) {
      this.dispatchEvent(
        new CustomEvent("pagechange", { detail: this._activePage - 1 })
      );
    }
  }

  handleFirstPageClick(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("pagechange", { detail: 1 }));
  }

  handleLastPageClick(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("pagechange", { detail: this._lastPage })
    );
  }

  handleNextPageClick(event) {
    event.preventDefault();

    if (this._activePage < this._lastPage) {
      this.dispatchEvent(
        new CustomEvent("pagechange", { detail: this._activePage + 1 })
      );
    }
  }
}
