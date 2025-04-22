import { LightningElement, api } from "lwc";
import {
  normaliseString,
  normaliseBoolean,
  formatTemplate
} from "c/sfGpsDsHelpers";
import StepNavigationMixin from "c/sfGpsDsAuVic2StepNavigationMixin";

const VARIANT_COMPLEX = "complex";
const VARIANT_SIMPLE = "simple";
const VARIANT_VALUES = [VARIANT_COMPLEX, VARIANT_SIMPLE];
const VARIANT_DEFAULT = VARIANT_COMPLEX;

const SHOWTALLY_DEFAULT = false;

const I18N = {
  goToPrevious: "Go to previous {contentType}",
  goToNext: "Go to next {contentType}",
  goToPage: "Go to {contentType} {step}",
  summary: "{currentPage} of {totalPages}"
};

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2Pagination";

export default class extends StepNavigationMixin(
  LightningElement,
  "currentPage",
  "surroundingPages",
  "totalPages"
) {
  @api label;
  @api totalPages;
  @api currentPage = 1;
  @api surroundingPages = 2;
  @api contentType = "page";
  @api prevLabel = "Previous";
  @api nextLabel = "Next";
  @api className;

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set variant", value);

    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set variant", this._variant);
  }

  /* api: showTally */

  _showTally = SHOWTALLY_DEFAULT;
  _showTallyOriginal = SHOWTALLY_DEFAULT;

  @api
  get showTally() {
    return this._showTallyOriginal;
  }

  set showTally(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set showTally", value);

    this._showTallyOriginal = value;
    this._showTally = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWTALLY_DEFAULT
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set showTally", this._showTally);
  }

  /* computed */

  get _isComplex() {
    return this._variant === VARIANT_COMPLEX;
  }

  get computedIconSize() {
    return this._isComplex ? "s" : "xs";
  }

  get computedClassName() {
    if (DEBUG) console.debug(CLASS_NAME, "> set computedClassName");

    const rv = {
      "rpl-pagination": true,
      "rpl-pagination-complex": this._isComplex,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    };

    if (DEBUG)
      console.debug(CLASS_NAME, "< set computedClassName", JSON.stringify(rv));
    return rv;
  }

  get computedShowActTotal() {
    return this._showTally && this._isComplex;
  }

  get computedSummary() {
    return formatTemplate(I18N.summary, {
      currentPage: this.currentPage,
      totalPages: this.totalPages
    });
  }

  get computedShowPrevPaginationLink() {
    return !this._isComplex || !this.isFirstStep;
  }

  get computedShowNextPaginationLink() {
    return !this._isComplex || !this.isLastStep;
  }

  get computedPrevAriaLabel() {
    return formatTemplate(I18N.goToPrevious, { contentType: this.contentType });
  }

  get computedNextAriaLabel() {
    return formatTemplate(I18N.goToNext, { contentType: this.contentType });
  }

  get computedPrevDisabled() {
    return !this._isComplex && this.isFirstStep;
  }

  get computedNextDisabled() {
    return !this._isComplex && this.isLastStep;
  }

  get decoratedVisibleSteps() {
    if (DEBUG) console.debug(CLASS_NAME, "> set decoratedVisibleSteps");

    const rv = this.visibleSteps.map((step) => ({
      index: step,
      ariaLabel: formatTemplate(I18N.goToPage, {
        contentType: this.contentType,
        step
      }),
      ariaCurrent: step === this.currentPage ? true : null
    }));

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< set decoratedVisibleSteps",
        JSON.stringify(rv)
      );
    return rv;
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
