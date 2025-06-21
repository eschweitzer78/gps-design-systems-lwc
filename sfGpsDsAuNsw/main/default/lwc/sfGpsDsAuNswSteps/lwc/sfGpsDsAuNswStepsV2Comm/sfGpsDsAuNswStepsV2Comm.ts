/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  isArray 
} from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

import type { 
  CStyle 
} from "c/sfGpsDsAuNswSteps";
import type { 
  HeadingLevel 
} from "c/sfGpsDsAuNswStepsItem";
import type { 
  Header 
} from "c/sfGpsDsMarkdown";


const CONTENT_DEFAULT: Header[] = [];

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswStepsComm";

import type { Size } from "c/sfGpsDsAuNswSteps";

export default 
class sfGpsDsAuNswStepsCommV2
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  type?: string;

  // @ts-ignore
  @api
  cstyle?: CStyle;

  // @ts-ignore
  @api
  size?: Size;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;

  // @ts-ignore
  @api 
  className?: string;

  /* api: content */

  _content: Header[] = CONTENT_DEFAULT;
  _contentOriginal?: string;

  // @ts-ignore
  @api
  get content(): string | undefined {
    return this._contentOriginal;
  }

  set content(markdown: string) {
    try {
      this._contentOriginal = markdown;
      this._content = mdEngine
        .extractH1s(markdown.replaceAll("\\n", "\n"))
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      this._content = CONTENT_DEFAULT;
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
    }
  }

  /* getters */

  get _isEmpty(): boolean {
    return isArray(this._content) ? this._content.length === 0 : true;
  }

  get computedHeadingLevel(): HeadingLevel {
    switch (this.size) {
      case "small":
        return 4;
      case "medium":
        return 3;
      case "large":
      default:
        return 2;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
