/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

/**
 * Ontario Design System Card for OmniStudio Custom LWC
 * Shadow DOM version for OmniStudio compatibility
 *
 * Usage in OmniScript:
 * - LWC Component Name: sfGpsDsCaOnCardOmni
 * - Custom Attributes:
 *   - title: Card title/heading
 *   - description: Card description text
 *   - imageUrl: URL to card image
 *   - ctaLabel: Call-to-action button label
 *   - ctaUrl: Call-to-action button URL
 *   - className: Additional CSS classes
 */
export default class SfGpsDsCaOnCardOmni extends LightningElement {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api title = "";
  @api description = "";
  @api imageUrl = "";
  @api ctaLabel = "";
  @api ctaUrl = "";
  @api className = "";

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get computedCardClassName() {
    let classes = "ontario-card";
    if (this.imageUrl) {
      classes += " ontario-card--image-true";
    }
    if (this.className) {
      classes += ` ${this.className}`;
    }
    return classes;
  }

  get hasImage() {
    return !!this.imageUrl;
  }

  get hasDescription() {
    return !!this.description;
  }

  get hasCta() {
    return !!this.ctaLabel && !!this.ctaUrl;
  }

  get hasCtaButton() {
    return !!this.ctaLabel;
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleCtaClick(event) {
    // Dispatch custom event for OmniScript integration
    this.dispatchEvent(
      new CustomEvent("ctaclick", {
        detail: {
          url: this.ctaUrl,
          label: this.ctaLabel
        },
        bubbles: true,
        composed: true
      })
    );

    // If no URL, prevent default navigation
    if (!this.ctaUrl) {
      event.preventDefault();
    }
  }

  handleCardClick(event) {
    // Only handle if clicking the card itself (not button)
    if (event.target.tagName !== "A" && event.target.tagName !== "BUTTON") {
      this.dispatchEvent(
        new CustomEvent("cardclick", {
          detail: {
            title: this.title,
            url: this.ctaUrl
          },
          bubbles: true,
          composed: true
        })
      );
    }
  }
}
