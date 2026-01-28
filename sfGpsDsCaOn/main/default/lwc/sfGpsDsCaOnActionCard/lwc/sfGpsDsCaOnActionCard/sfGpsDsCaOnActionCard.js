/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnActionCard";

/**
 * @slot ActionCard-Description
 * @description Ontario Design System Action Card component.
 *
 * Displays an action card with:
 * - Colored header bar with icon and title
 * - Description text
 * - Primary action button
 * - Optional secondary link
 *
 * Used for permission/service selection pages.
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Custom styling based on Ontario DS patterns
 * - WCAG 2.1 AA: Proper headings, keyboard accessible
 */
export default class SfGpsDsCaOnActionCard extends LightningElement {
  static renderMode = "light";

  /**
   * Icon URL or SVG reference for the header
   */
  @api icon;

  /**
   * Alternative text for the icon (accessibility)
   */
  @api iconAltText;

  /**
   * Card heading/title displayed in the header bar
   */
  @api heading;

  /**
   * Heading level for accessibility (h2, h3, h4)
   */
  @api headingLevel = "h3";

  /**
   * Header bar background color
   */
  @api headerColour = "dark-blue";

  /**
   * Description text (HTML supported)
   */
  @api description;

  /**
   * Primary action button label
   */
  @api buttonLabel;

  /**
   * Primary action button URL
   */
  @api buttonUrl;

  /**
   * Secondary link label (optional)
   */
  @api linkLabel;

  /**
   * Secondary link URL (optional)
   */
  @api linkUrl;

  /**
   * Additional CSS class
   */
  @api className;

  /* computed */

  get computedCardClassName() {
    return computeClass({
      "sfgpsdscaon-action-card": true,
      [this.className]: this.className
    });
  }

  get computedHeaderClassName() {
    return computeClass({
      "sfgpsdscaon-action-card__header": true,
      [`sfgpsdscaon-action-card__header--${this.headerColour}`]:
        this.headerColour
    });
  }

  get hasIcon() {
    return Boolean(this.icon);
  }

  get hasDescription() {
    return Boolean(this.description);
  }

  get hasButton() {
    return Boolean(this.buttonLabel && this.buttonUrl);
  }

  get hasLink() {
    return Boolean(this.linkLabel && this.linkUrl);
  }

  get isH2() {
    return this.headingLevel === "h2";
  }

  get isH3() {
    return this.headingLevel === "h3";
  }

  get isH4() {
    return this.headingLevel === "h4";
  }

  get computedIconAltText() {
    return this.iconAltText || "";
  }

  /**
   * Whether the icon has alt text and should be accessible
   * @returns {boolean}
   */
  get hasMeaningfulIcon() {
    return this.hasIcon && Boolean(this.iconAltText);
  }

  /**
   * Whether the icon is decorative (no alt text)
   * @returns {boolean}
   */
  get hasDecorativeIcon() {
    return this.hasIcon && !this.iconAltText;
  }

  /* lifecycle */

  connectedCallback() {
    this.classList.add("caon-scope");
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }
}
