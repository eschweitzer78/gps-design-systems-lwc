/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.14
 */

import { LightningElement, api, track } from "lwc";
import { normaliseString, isArray } from "c/sfGpsDsHelpers";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";
import OnWindowResize from "c/sfGpsDsOnWindowResize";
import OnClickOutside from "c/sfGpsDsOnClickOutside";

const MODE_DEFAULT = "default";
const MODE_DESKTOP = "desktop";
const MODE_MOBILE = "mobile";
const MODE_TABLET = "tablet";
const MODE_VALUES = [MODE_DEFAULT, MODE_DESKTOP, MODE_MOBILE, MODE_TABLET];

const I18N = {
  overflowMenuAriaLabel: "Overflow menu"
};

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

export default class extends LightningElement {
  @api label = "breadcrumbs";
  @api className = "";

  @track _nOverflow;
  @track _isOverflowOpen = false;

  _onWindowResize;
  _onClickOutside;

  /* api: items */

  _items = [];

  @api
  get items() {
    return this._items;
  }

  set items(value) {
    this._items = isArray(value) ? value : [];
    this._nOverflow = null;
  }

  /* api: mode */

  _mode;
  _modeOriginal;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });
  }

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedShowDesktop() {
    return this._mode === MODE_DEFAULT || MODE_DESKTOP;
  }

  get computedShowMobile() {
    return this._mode === MODE_DEFAULT || MODE_MOBILE;
  }

  get computedShowTablet() {
    return this._mode === MODE_DEFAULT || MODE_TABLET;
  }

  get computedClassName() {
    return {
      qld__breadcrumbs: true,
      [this.className]: this.className
    };
  }

  get decoratedItems() {
    const length = this.computedSafeLength;
    return (this.items || []).map((item, index) => ({
      ...item,
      _isLast: index === length - 1,
      _isButLast: index === length - 2,
      _isPreOverflow: index === 0,
      _isOverflow: index > 0 && index <= this._nOverflow,
      _isPostOverflow: index > this._nOverflow
    }));
  }

  get computedSafeLength() {
    return this.items?.length || 0;
  }

  get computedOverflowButtonClassName() {
    return {
      qld__btn: true,
      "qld__btn--toggle": true,
      qld__overflow_menu__btn: true,
      "qld__accordion--closed": !this._isOverflowOpen,
      "qld__accordion--open": this._isOverflowOpen
    };
  }

  get computedOverflowClassName() {
    return {
      qld__overflow_menu: true,
      "qld__accordion--closed": !this._isOverflowOpen,
      "qld__accordion--open": this._isOverflowOpen
    };
  }

  get computedMoreHorizontalIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#more-horizontal";
  }

  /* methods */

  checkOverflow() {
    const breadcrumbsUl = this.refs.desktop;
    const length = this.computedSafeLength;

    if (breadcrumbsUl && this._nOverflow == null) {
      if (!length) {
        this._nOverflow = 0;
        return;
      }
      /*
       * Only run the following is showing desktop and we haven't
       * established yet whether there is an overflow
       */

      let totalLisOffsetWidth = 0;
      const breadcrumbsUlLis = breadcrumbsUl.querySelectorAll("li");
      const zeroOffsetHeight = breadcrumbsUlLis[0].offsetHeight;

      for (let i = 0; i < length; i++) {
        totalLisOffsetWidth += breadcrumbsUlLis[i].offsetWidth;
      }

      if (length > 2 && zeroOffsetHeight > 0) {
        let nOverflow = 0;

        if (length > 5) {
          nOverflow = length - 3;
        } else if (
          breadcrumbsUl.scrollWidth > breadcrumbsUl.offsetWidth ||
          breadcrumbsUl.offsetHeight > zeroOffsetHeight * 1.9
        ) {
          let i = 1;

          while (
            (breadcrumbsUl.scrollWidth > breadcrumbsUl.offsetWidth ||
              breadcrumbsUl.offsetHeight > zeroOffsetHeight * 1.9) &&
            i < length - 2
          ) {
            breadcrumbsUlLis[i++].style.display = "none";
            nOverflow++;
          }
        } else if (
          parseFloat(breadcrumbsUl.style.maxWidth.replace(/[^\d.]/g, "")) <
          totalLisOffsetWidth
        ) {
          let i = 1;
          while (
            parseFloat(breadcrumbsUl.style.maxWidth.replace(/[^\d.]/g, "")) <
              totalLisOffsetWidth &&
            i < length - 2
          ) {
            totalLisOffsetWidth -= breadcrumbsUlLis[i].offsetWidth;
            breadcrumbsUlLis[i++].style.display = "none";
            nOverflow++;
          }
        }

        this._nOverflow = nOverflow;
      }
    }
  }

  /* event management */
  /* ---------------- */

  handleOverflowButtonToggle() {
    this._isOverflowOpen = !this._isOverflowOpen;
  }

  /* lifecycle */
  /* --------- */

  connectedCallback() {
    if (!this._onWindowResize) {
      this._onWindowResize = new OnWindowResize();
      this._onWindowResize.bind(() => {
        // Force recalculation of overflow
        this._nOverflow = null;
      });
    }
  }

  disconnectedCallback() {
    if (this._onWindowResize) {
      this._onWindowResize.unbind();
    }

    if (this._onClickOutside) {
      this._onClickOutside.unbind(this, "containerRef");
    }
  }

  renderedCallback() {
    if (!this._onClickOutside && this.refs.containerRef) {
      this._onClickOutside = new OnClickOutside();
      this._onClickOutside.bind(this, "containerRef", () => {
        this._isOverflowOpen = false;
      });
    }

    if (this._onClickOutside && !this.refs.containerRef) {
      // The overflow button was removed from the DOM
      this._onClickOutside.unbind(this, "containerRef");
      this._onClickOutside = null;
      this._isOverflowOpen = false;
    }

    this.checkOverflow();
  }
}
