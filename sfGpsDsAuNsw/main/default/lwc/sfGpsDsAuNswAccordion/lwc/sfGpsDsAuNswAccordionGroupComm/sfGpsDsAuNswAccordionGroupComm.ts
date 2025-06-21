/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import type SfGpsDsAuNswAccordion from "c/sfGpsDsAuNswAccordion";
import type { 
  Header 
} from "c/sfGpsDsMarkdown";

interface ContentItem extends Header {
  closed: boolean
}

const CONTENT_DEFAULT: ContentItem[] = [];

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswAccordionGroupComm"

export default
class SfGpsDsAuNswAccordioGroupComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  showButtons?: boolean;

  // @ts-ignore
  @api 
  className?: string;

  /* api: content */

  _content: ContentItem[] = CONTENT_DEFAULT;
  _contentOriginal = "";
  _numberOpen = 0;

  // @ts-ignore
  @api
  get content(): string | undefined {
    return this._contentOriginal;
  }

  set content(markdown: string) {
    if (DEBUG) console.debug(CLASS_NAME, "> set content", markdown);

    try {
      this._contentOriginal = markdown;
      this._content = mdEngine
        .extractH1s(markdown.replaceAll("\\n", "\n"))
        .map((h1) => ({ ...h1, closed: true } as ContentItem));
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }

    if (DEBUG) console.debug(CLASS_NAME, "< set content", JSON.stringify(this._content));
  }

  /* computed */

  get computedIsFullyExpanded() {
    if (DEBUG) console.debug(CLASS_NAME, "> get computedIsFullyExpanded");

    const rv = this._numberOpen === this._content.length;
  
    if (DEBUG) console.debug(CLASS_NAME, "< get computedIsFullyExpanded", rv);
    return rv;
  }

  get computedIsFullyCollapsed() {
    if (DEBUG) console.debug(CLASS_NAME, "> get computedIsFullyCollapsed");

    const rv = this._numberOpen === 0;

    if (DEBUG) console.debug(CLASS_NAME, "< get computedIsFullyCollapsed", rv);
    return rv;
  }

  /* event management */

  handleExpand(event: CustomEvent): void {
    const target = event.target as unknown as SfGpsDsAuNswAccordion;

    if (DEBUG) console.debug(CLASS_NAME, "> handleExpand", "index=", target.index);

    this._content[+ target.index].closed = false;
    this._numberOpen++;

    if (DEBUG) console.debug(CLASS_NAME, "< handleExpand", this._numberOpen);
  }

  handleCollapse(event: CustomEvent): void {
    const target = event.target as unknown as SfGpsDsAuNswAccordion;

    if (DEBUG) console.debug(CLASS_NAME, "> handleCollapse", "index=", target.index);
    this._content[+ target.index].closed = true;
    this._numberOpen--;

    if (DEBUG) console.debug(CLASS_NAME, "< handleCollapse", this._numberOpen);
  }

  // eslint-disable-next-line no-unused-vars
  handleExpandAll(_event: CustomEvent): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleExpandAll");

    this._numberOpen = this._content.length;
    this._content.forEach((h1) => (h1.closed = false));

    if (DEBUG) console.debug(CLASS_NAME, "< handleExpandAll", this._numberOpen);
  }

  // eslint-disable-next-line no-unused-vars
  handleCollapseAll(_event: CustomEvent): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleCollapseAll");

    this._numberOpen = 0;
    this._content.forEach((h1) => (h1.closed = true));

    if (DEBUG) console.debug(CLASS_NAME, "< handleCollapseAll", this._numberOpen);
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
