/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnActionCardComm";

/**
 * @slot ActionCard-Description
 * @description Ontario Design System Action Card for Experience Builder.
 *
 * Displays an action card with:
 * - Colored header bar with icon and title
 * - Description text (supports Markdown)
 * - Primary action button
 * - Optional secondary link
 *
 * Use with sfGpsDsCaOnActionCardCollectionComm for grid layouts.
 *
 * Example usage:
 * - Permission selection pages ("Apply or Register")
 * - Service catalog pages
 * - Action menu cards
 */
export default class SfGpsDsCaOnActionCardComm extends SfGpsDsLwc {
  static renderMode = "light";

  /**
   * Icon URL for the header (e.g., static resource URL)
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
   * Description text in Markdown format
   */
  @api description;
  _descriptionHtml = this.defineMarkdownContentProperty("description", {
    errorCode: "AC-MD",
    errorText: "Issue when parsing Description markdown"
  });

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

  get hasCustomDescription() {
    return Boolean(this.description);
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this.refs.description && this._descriptionHtml.value) {
      replaceInnerHtml(this.refs.description, this._descriptionHtml.value);
    }
  }
}
