import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api lastPage;
  @api activePage;
  @api ariaLabel = "Pagination";
  @api className;

  /* computed */

  get computedFirstPage() {
    return 1;
  }

  get computedPrevPage() {
    return this.activePage - 1;
  }

  get computedNextPage() {
    return this.activePage + 1;
  }

  get computedShowPrevious() {
    return this.activePage > 1;
  }

  get computedShowFirstPage() {
    return this.activePage > 2;
  }

  get showPrevEllipsis() {
    return this.activePage > 3;
  }

  get computedShowPrevPage() {
    return this.activePage > 1;
  }

  get computedShowActivePage() {
    return this.lastPage > 0;
  }

  get computedShowNextPage() {
    return this.activePage < this.lastPage;
  }

  get computedShowNextEllipsis() {
    return this.activePage < this.lastPage - 2;
  }

  get computedShowLastPage() {
    return this.activePage < this.lastPage - 1;
  }

  get computedShowNext() {
    return this.activePage < this.lastPage;
  }

  get computedClassName() {
    return {
      "qld__search-pagination": true,
      "qld__search-pagination--outline": true,
      "hidden-print": true,
      [this.className]: this.className
    };
  }

  get computedPreviousDisabled() {
    return !this.computedShowPrevious;
  }

  get computedPrevPageClassName() {
    return {
      "qld__search-pagination_link": true,
      disabled: this.computedPreviousDisabled
    };
  }

  get computedNextDisabled() {
    return !this.computedShowNext;
  }

  get computedNextPageClassName() {
    return {
      "qld__search-pagination_link": true,
      disabled: this.computedNextDisabled
    };
  }

  /* events */

  handlePreviousPageClick(event) {
    event.preventDefault();
    if (this.activePage > 1) {
      this.dispatchEvent(
        new CustomEvent("pagechange", { detail: this.activePage - 1 })
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
      new CustomEvent("pagechange", { detail: this.lastPage })
    );
  }

  handleNextPageClick(event) {
    event.preventDefault();

    if (this.activePage < this.lastPage) {
      this.dispatchEvent(
        new CustomEvent("pagechange", { detail: this.activePage + 1 })
      );
    }
  }
}
