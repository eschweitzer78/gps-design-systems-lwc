/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.14
 */

import { LightningElement, api } from "lwc";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

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

  get computedArrowLeftIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#arrow-left";
  }

  get computedArrowRightIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#arrow-right";
  }

  get computedMoreHorizontalIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#more-horizontal";
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
