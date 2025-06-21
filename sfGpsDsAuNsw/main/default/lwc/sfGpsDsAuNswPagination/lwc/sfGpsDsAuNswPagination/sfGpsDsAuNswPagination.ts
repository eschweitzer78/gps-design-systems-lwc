import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

const ACTIVEPAGE_DEFAULT = 1;
const LASTPAGE_DEFAULT = 1;

export default 
class SfGpsDsAuNswPagination 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  ariaLabel = "Pagination";

  // @ts-ignore
  @api 
  srOnlyPre = "Page ";

  // @ts-ignore
  @api 
  srOnlyPost?: string;

  // @ts-ignore
  @api 
  srOnlyPrevious = "Previous";

  // @ts-ignore

  @api 
  srOnlyNext = "Next";

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  lastPage?: number;
  _lastPage = this.defineIntegerProperty("lastPage", {
    defaultValue: LASTPAGE_DEFAULT
  });

  // @ts-ignore
  @api
  activePage?: number;
  _activePage = this.defineIntegerProperty("activePage", {
    defaultValue: ACTIVEPAGE_DEFAULT
  });

  /* computed */

  get computedFirstPage(): number {
    return 1;
  }

  get computedPrevPage(): number {
    return this._activePage.value - 1;
  }

  get computedNextPage(): number {
    return this._activePage.value + 1;
  }

  get computedShowPrevious(): boolean {
    return this._activePage.value > 1;
  }

  get computedShowFirstPage(): boolean {
    return this._activePage.value > 2;
  }

  get computedShowPrevEllipsis(): boolean {
    return this._activePage.value > 3;
  }

  get computedShowPrevPage(): boolean {
    return this._activePage.value > 1;
  }

  get computedShowActivePage(): boolean {
    return this._lastPage.value > 0;
  }

  get computedShowNextPage(): boolean {
    return this._activePage.value < this._lastPage.value;
  }

  get computedShowNextEllipsis(): boolean {
    return this._activePage.value < this._lastPage.value - 2;
  }

  get computedShowLastPage(): boolean {
    return this._activePage.value < this._lastPage.value - 1;
  }

  get computedShowNext(): boolean {
    return this._activePage.value < this._lastPage.value;
  }

  get computedClassName(): any {
    return {
      "nsw-pagination": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedPreviousDisabled(): boolean {
    return !this.computedShowPrevious;
  }

  get computedPrevPageClassName(): any {
    return {
      "nsw-icon-button": true,
      disabled: this.computedPreviousDisabled
    };
  }

  get computedNextDisabled(): boolean {
    return !this.computedShowNext;
  }

  get computedNextPageClassName(): any {
    return {
      "nsw-icon-button": true,
      disabled: this.computedNextDisabled
    };
  }

  /* event management */

  handlePreviousPageClick(
    event: MouseEvent
  ): void {
    event.preventDefault();

    const activePage = this._activePage.value;
    if (activePage > 1) {
      this.dispatchEvent(
        new CustomEvent("pagechange", { 
          detail: activePage - 1 
        })
      );
    }
  }

  handleFirstPageClick(
    event: MouseEvent
  ): void {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("pagechange", { 
      detail: 1 
    }));
  }

  handleLastPageClick(
    event: MouseEvent
  ): void {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("pagechange", { 
        detail: this._lastPage.value 
      })
    );
  }

  handleNextPageClick(
    event: MouseEvent
  ): void {
    event.preventDefault();

    if (this._activePage.value < this._lastPage.value) {
      this.dispatchEvent(
        new CustomEvent("pagechange", { 
          detail: this._activePage.value + 1 
        })
      );
    }
  }
}
