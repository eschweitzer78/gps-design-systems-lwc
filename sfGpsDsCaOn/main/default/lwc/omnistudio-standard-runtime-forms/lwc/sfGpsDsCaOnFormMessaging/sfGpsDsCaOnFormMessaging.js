/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMessaging from "c/sfGpsDsFormMessaging";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";
import tmpl from "./sfGpsDsCaOnFormMessaging.html";

// Debug flag - set to true to enable console logging
const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormMessaging";

/**
 * @slot Messaging
 * @description Ontario Design System Messaging component for OmniStudio forms.
 * Displays alert messages using Ontario DS page alerts.
 * Supports Success, Requirement (Error), Warning, and Comment (Info) message types.
 *
 * Features:
 * - Supports Markdown content including links, bold, italic, lists
 * - Automatically renders hyperlinks in message text
 * - Maps OmniStudio message types to Ontario alert styles
 *
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-page-alert web component
 * - WCAG 2.1 AA: Alert role for screen readers, proper color contrast
 *
 * @example
 * // In OmniScript, configure a Messaging element with:
 * // Message Type: Requirement (for hard stop errors)
 * // Message Text: "Based on your answer, you may need to [apply for an ECA](https://example.com)."
 */
export default class SfGpsDsCaOnFormMessaging extends SfGpsDsFormMessaging {
  /* private */

  _messageHtml = "";

  /* computed */

  /**
   * Maps OmniStudio message types to Ontario DS alert types
   * @returns {string} Ontario alert type: success, error, warning, or informational
   */
  get ontarioAlertType() {
    if (this.isSuccess) return "success";
    if (this.isRequirement) return "error";
    if (this.isWarning) return "warning";
    if (this.isComment) return "informational";
    return "informational";
  }

  /**
   * Gets the merged title text from OmniScript properties
   * @returns {string} Title text for the alert heading
   */
  get mergedTitleText() {
    return this._propSetMap?.titleText || "";
  }

  /**
   * Gets the merged message text from OmniScript properties
   * @returns {string} Message text (may contain Markdown)
   */
  get mergedMessageText() {
    return this._propSetMap?.messageText || "";
  }

  /**
   * Check if message text exists
   * @returns {string|undefined} Message text or undefined
   */
  get messageText() {
    return this._propSetMap?.messageText;
  }

  /**
   * Check if we have content to display
   * @returns {boolean} True if there is message content
   */
  get hasContent() {
    return Boolean(this.messageText);
  }

  /* methods */

  /**
   * Parses Markdown content and converts to HTML
   * Supports: links, bold, italic, lists, paragraphs
   * @param {string} markdown - Markdown text to parse
   * @returns {string} HTML string
   */
  parseMarkdown(markdown) {
    if (!markdown) return "";

    try {
      // Use the markdown engine to convert to HTML
      const html = mdEngine.renderInline(markdown);
      if (DEBUG) console.log(CLASS_NAME, "parseMarkdown", { markdown, html });
      return html;
    } catch (error) {
      console.error(CLASS_NAME, "Error parsing markdown:", error);
      // Fallback to plain text if parsing fails
      return markdown;
    }
  }

  /**
   * Updates the message HTML content
   * Called when the component renders or message changes
   */
  updateMessageContent() {
    const contentRef = this.refs?.content;
    if (contentRef && this.messageText) {
      const html = this.parseMarkdown(this.messageText);
      if (html !== this._messageHtml) {
        this._messageHtml = html;
        replaceInnerHtml(contentRef, html);
        if (DEBUG) console.log(CLASS_NAME, "updateMessageContent", { html });
      }
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.classList.add("caon-scope");

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this._propSetMap);
  }

  renderedCallback() {
    if (super.renderedCallback) {
      super.renderedCallback();
    }

    this.updateMessageContent();
  }
}
