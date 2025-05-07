/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.9
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

const SCROLL_THRESHOLD = 750;

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api label;
  @api targetId;
  @api className;

  @track scrollY = 0;

  /* computed */

  get computedClassName() {
    return {
      qld__btn: true,
      "qld__btn--floating": true,
      "qld__btn--back-to-top": true,
      "sfgpsdsauqld__btn--back-to-top--show": !this.computedIsHidden,
      [this.className]: this.className
    };
  }

  get computedIsHidden() {
    return this.scrollY <= SCROLL_THRESHOLD;
  }

  get computedArrowUpIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#arrow-up";
  }

  get computedHref() {
    return `#${this.targedId || ""}`;
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  handleScroll() {
    const rootElement = this.refs.containerRef;

    if (rootElement) {
      this.scrollY = window.scrollY || window.pageYOffset;
    }
  }

  /* lifecycle */

  _handleScroll;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");

    this._handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this._handleScroll);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._handleScroll);
  }
}
