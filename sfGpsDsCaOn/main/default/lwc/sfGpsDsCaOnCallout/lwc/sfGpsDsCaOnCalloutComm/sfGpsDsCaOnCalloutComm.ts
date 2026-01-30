/*
* Copyright (c) 2025, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnCalloutComm";

export default 
class SfGpsDsCaOnCalloutComm 
extends SfGpsDsLwc {
  static renderMode = "light";
  // @ts-ignore
  @api 
  content?: string;
  _contentHtml = this.defineMarkdownContentProperty("content", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Content markdown"
  });

  // @ts-ignore
  @api 
  heading?: string;
  _headingHtml = this.defineMarkdownContentProperty("heading", {
    errorCode: "HC-MD",
    errorText: "Issue when parsing Heading markdown"
  });

  // @ts-ignore
  @api 
  highlightColour?: string;

  // @ts-ignore
  @api 
  headingLevel?: string;

  /**
   * Callout type for alert-style callouts with background colors and icons.
   * - default: Standard callout with border color only
   * - information: Blue background with info icon
   * - warning: Yellow/gold background with warning icon (for regulatory notices)
   * - error: Red background with error icon (for hard stops/ineligibility)
   * - success: Green background with success icon
   */
  // @ts-ignore
  @api 
  type?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* getters */

  /**
   * Returns true if the heading slot should be shown.
   * Note: Can't use lwc:else on slot elements.
   */
  get showHeadingSlot(): boolean {
    return !this.heading;
  }

  /**
   * Returns true if the content slot should be shown.
   * Note: Can't use lwc:else on slot elements.
   */
  get showContentSlot(): boolean {
    return !this.content;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }

  renderedCallback() {
    super.renderedCallback();

    if (this.refs.heading) {
      replaceInnerHtml(this.refs.heading, this._headingHtml.value);
    }
    if (this.refs.content) {
      replaceInnerHtml(this.refs.content, this._contentHtml.value);
    }
  }
}
