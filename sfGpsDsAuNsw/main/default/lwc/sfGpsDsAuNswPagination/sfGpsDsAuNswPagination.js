import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswPagination extends LightningElement {
  @api lastPage;
  @api activePage;

  @api ariaLabel = "Pagination";
  @api srOnlyPre = "Page ";
  @api srOnlyPost;
  @api srOnlyPrevious = "Back";
  @api srOnlyNext = "Next";

  @api className;

  get firstPage() {
    return 1;
  }

  get prevPage() {
    return this.activePage - 1;
  }

  get nextPage() {
    return this.activePage + 1;
  }

  get showPrevious() {
    return this.activePage > 1;
  }

  get showFirstPage() {
    return this.activePage > 2;
  }

  get showPrevEllipsis() {
    return this.activePage > 3;
  }

  get showPrevPage() {
    return this.activePage > 1;
  }

  get showActivePage() {
    return this.lastPage > 0;
  }

  get showNextPage() {
    return this.activePage < this.lastPage;
  }

  get showNextEllipsis() {
    return this.activePage < this.lastPage - 2;
  }

  get showLastPage() {
    return this.activePage < this.lastPage - 1;
  }

  get showNext() {
    return this.activePage < this.lastPage;
  }

  get computedClassName() {
    return computeClass({
      "nsw-pagination": true,
      [this.className]: this.className
    });
  }

  get previousDisabled() {
    return !this.showPrevious;
  }

  get nextDisabled() {
    return !this.showNext;
  }

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
