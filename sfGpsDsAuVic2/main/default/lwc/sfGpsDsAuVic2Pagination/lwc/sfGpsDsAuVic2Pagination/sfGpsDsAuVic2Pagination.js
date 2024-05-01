import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import StepNavigationMixin from "c/sfGpsDsAuVic2StepNavigationMixin";

export default class SfGpsDsAuVic2Pagination extends StepNavigationMixin(
  LightningElement
) {
  @api label;
  @api totalPages;
  @api currentPage = 1;
  @api surroundingPages = 2;
  @api contentType = "page";
  @api showTally = false;
  @api variant = "complex";
  @api prevLabel = "Previous";
  @api nextLabel = "Next";
  @api className;

  get computedTotalSteps() {
    return this.totalPages;
  }

  get isComplex() {
    return this.variant === "complex";
  }

  get computedIconSize() {
    return this.isComplex ? "s" : "xs";
  }

  get computedClassName() {
    return computeClass({
      "rpl-pagination": true,
      "rpl-pagination-complex": this.isComplex,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
  }

  get computedShowActTotal() {
    return this.showTally && this.isComplex;
  }

  get computedShowPrevPaginationLink() {
    return !this.isComplex || !this.isFirstStep;
  }

  get computedShowNextPaginationLink() {
    return !this.isComplex || !this.isLastStep;
  }

  get computedPrevAriaLabel() {
    return `Go to previous ${this.contentType}`;
  }

  get computedNextAriaLabel() {
    return `Go to next ${this.contentType}`;
  }

  get computedPrevDisabled() {
    return !this.isComplex && this.isFirstStep;
  }

  get computedNextDisabled() {
    return !this.isComplex && this.isLastStep;
  }

  handlePrevClick() {
    this.handleClick(this.activeStep - 1, "prev", this.prevLabel);
  }

  handleNextClick() {
    this.handleClick(this.activeStep + 1, "next", this.nextLabel);
  }

  handleNumberClick(event) {
    const ndx = event.target.dataset.ndx;
    const index = parseInt(ndx, 10);
    this.handleClick(index, "page", ndx);
  }

  handleClick(value, action, label) {
    this.updateStep(value);
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          text: label,
          action,
          value
        }
      })
    );
  }
}
