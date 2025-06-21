/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  debounce 
} from "c/sfGpsDsHelpers";

const MOBILE_BREAKPOINT = 768;
const DEBOUNCE_DELAY = 250;

export default 
class sfGpsDsAuNswBackToTop
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  scrollOffset = 0;

  // @ts-ignore
  @api 
  className?: string;

  _show?: boolean;
  _width?: number;
  _height?: number;
  _scrollPosition = 0;

  /* getters */

  get _isMobile(): boolean {
    return this._width 
      ? this._width < MOBILE_BREAKPOINT 
      : false;
  }

  /* methods */

  checkBackToTop(): void {
    const windowTop = window.scrollY || document.documentElement.scrollTop;
    const scroll = this._scrollPosition;

    this._scrollPosition = window.scrollY;

    if (this.scrollOffset && this.scrollOffset > 0) {
      this._show = windowTop >= this.scrollOffset;
    } else {
      this._show = scroll > this._scrollPosition && this._scrollPosition > 200;
    }
  }

  resize(): void {
    this._width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    this._height = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
  }

  /* lifecycle */

  constructor() {
    super();

    this.handleFirstRender(() => {
      this.checkBackToTop();
      this.resize();
    })
  }

  _listenForScroll: any;
  _listenForResize: any;

  connectedCallback() {
    this._listenForScroll = debounce(this.checkBackToTop.bind(this), DEBOUNCE_DELAY);
    window.addEventListener("scroll", this._listenForScroll);

    this._listenForResize = debounce(this.resize.bind(this), DEBOUNCE_DELAY);
    window.addEventListener("resize", this._listenForResize);
  }

  disconnectedCallback() {
    if (this._listenForScroll) {
      window.removeEventListener("scroll", this._listenForScroll);
    }

    if (this._listenForResize) {
      window.removeEventListener("resize", this._listenForResize);
    }
  }
}
