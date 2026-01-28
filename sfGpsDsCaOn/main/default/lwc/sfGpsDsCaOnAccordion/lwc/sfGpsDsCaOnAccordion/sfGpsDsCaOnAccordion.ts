/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnAccordion";

export default class SfGpsDsCaOnAccordion extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  isOpen?: boolean = false;

  // @ts-ignore
  @api
  accordionId?: string;

  // @ts-ignore
  @api
  className?: string;

  get computedClassName(): string {
    return `ontario-accordion ${this.isOpen ? "open" : ""} ${this.className || ""}`.trim();
  }

  get computedHeadingClassName(): string {
    return `ontario-accordion__heading ${this.isOpen ? "ontario-expander--active" : ""}`;
  }

  get computedContentClassName(): string {
    return `ontario-accordion__content ${this.isOpen ? "ontario-accordion__content--opened" : "ontario-accordion__content--closed"}`;
  }

  get computedAriaExpanded(): string {
    return this.isOpen ? "true" : "false";
  }

  get computedAriaHidden(): string {
    return this.isOpen ? "false" : "true";
  }

  get buttonId(): string {
    return `${this.accordionId}-button`;
  }

  get contentId(): string {
    return `${this.accordionId}-content`;
  }

  handleClick(): void {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { accordionId: this.accordionId },
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
