import { LightningElement, api } from "lwc";
import { BreakpointsMixin } from "c/sfGpsDsAuVic2BreakpointsMixin";

const CHANGE_NOTICE_DEFAULT = true;

export default class SfGpsDsAuVic2Slider extends BreakpointsMixin(
  LightningElement
) {
  @api perView = 1;
  @api showPagination = false;
  @api showTally = false;
  @api effect;
  @api currentSlide = 0;
  @api label;
  @api contentType = "item";
  @api itemElement = "li";
  @api wrapperElement = "ul";

  _changeNoticeOriginal = CHANGE_NOTICE_DEFAULT;
  _changeNotice = CHANGE_NOTICE_DEFAULT;

  @api get changeNotice() {
    return this._changeNoticeOriginal;
  }

  set changeNotice(value) {
    this._changeNoticeOriginal = value;
    this._changeNotice = value;
  }

  _slides = [];

  @api get slides() {
    return this._slides || [];
  }

  set slides(value) {
    this._slides = value;
  }

  get isXSmallScreen() {
    return this.bpGreaterOrEqual("sm");
  }

  get isSmallScreen() {
    return this.bpGreaterOrEqual("s");
  }

  get isMediumScreen() {
    return this.bpGreaterOrEqual("m");
  }

  get isLargeScreen() {
    return this.bpGreaterOrEqual("l");
  }

  get isXLargeScreen() {
    return this.bpGreaterOrEqual("xl");
  }

  get computedSlidesInView() {
    let bp = null;

    if (Number.isInteger(this.perView)) {
      return this.perView;
    }

    if (this.isXLargeScreen && this.perView?.xl) {
      bp = "xl";
    } else if (this.isLargeScreen && this.perView?.l) {
      bp = "l";
    } else if (this.isMediumScreen && this.perView?.m) {
      bp = "m";
    } else if (this.isSmallScreen && this.perView?.s) {
      bp = "s";
    } else if (this.isXSmallScreen.value && this.perView?.xs) {
      bp = "xs";
    }

    return this.perView?.[bp] || 1;
  }

  get computedTotalPages() {
    return this.slides.length - this.slidesInView + 1;
  }

  get computedSpaceBetween() {
    if (this.isXLargeScreen) {
      return 28;
    } else if (this.isMediumScreen) {
      return 24;
    }
    return 16;
  }

  get computedShowPagination() {
    return (
      this.showPagination && this._slides.length > 1 && this.totalPages > 1
    );
  }

  get slideChangeNotice() {
    const items =
      this.slidesInView > 1
        ? `${this.activePage} to ${this.activePage + (this.slidesInView - 1)}`
        : `${this.activePage}`;

    let notice = `Showing ${this.contentType} ${items} of ${this.slides.length}`;

    return typeof this.changeNotice === "string"
      ? `${notice}, ${this.changeNotice}`
      : notice;
  }

  /* methods */

  paginationClick = ({ action, text, value }) => {
    this.paginate = true;
    this.swiper.swiper.slideTo(value - 1);

    this.dispatchEvent(
      new CustomEvent("change", {
        type: "paginate",
        action,
        text,
        value: value - 1
      })
    );
  };

  slideUpdate({ activeIndex, slides }) {
    const previousPage = this.activePage || 1;
    this.activePage = activeIndex + 1;
    this.setInert({ activeIndex, slides });

    if (this.paginate) {
      this.paginate = false;
    } else {
      this.dispatchEvent(
        new CustomEvent("change", {
          type: "swipe",
          action: this.activePage.value > previousPage ? "next" : "prev",
          value: activeIndex
        })
      );
    }
  }

  setInert({ activeIndex, slides }) {
    slides.each((slide, index) =>
      slide.toggleAttribute(
        "inert",
        index < activeIndex || index >= activeIndex + this.slidesInView
      )
    );
  }
}
