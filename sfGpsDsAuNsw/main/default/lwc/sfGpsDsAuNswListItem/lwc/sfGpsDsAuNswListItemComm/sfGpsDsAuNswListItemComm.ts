/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import { 
  parseIso8601, 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  DateStyle 
} from "c/sfGpsDsAuNswListItem";

const DATE_STYLE_DEFAULT = "medium";

/* eslint-disable-lint no-unused-var */
const DEBUG = false;
/* eslint-disable-lint no-unused-var */
const CLASS_NAME = "sfGpsDsAuNswListItemComm";

export default 
class SfGpsDsAuNswListItemComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  isBlock = false;

  // @ts-ignore
  @api 
  isReversed = false;

  // @ts-ignore
  @api 
  showLink = false;

  // @ts-ignore
  @api 
  dateStyle: DateStyle = DATE_STYLE_DEFAULT;

  // @ts-ignore
  @api 
  className?: string;

  // This is not exposed in Experience Builder and is used by listItemCollectionComm
  // @ts-ignore
  @api 
  useMarkup = false;

  // @ts-ignore
  @api 
  headline?: string;
  _headline = this.defineMarkdownFirstLinkProperty("headline", {
    errorCode: "HL-MD",
    errorText: "Issue when parsing Headline markdown"
  });

  /* api: date, String or Date */

  _date?: Date;
  _dateOriginal?: Date | string;

  // @ts-ignore
  @api
  get date(): Date | string | undefined {
    return this._dateOriginal;
  }

  set date(value: Date | string) {
    this._dateOriginal = value;

    if (value instanceof Date) {
      this._date = value;
    } else {
      this._date = value 
        ? parseIso8601(value.toString()) 
        : undefined;
    }
  }

  // @ts-ignore
  @api 
  copy?: string;
  _copyHtml = this.defineMarkdownContentProperty("copy", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Copy markdown"
  });


  // @ts-ignore
  @api 
  tags?: string;
  _tags = this.defineMarkdownLinksProperty("tags", {
    errorCode: "TA-MD",
    errorText: "Issue when parsing Tags markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();
    
    if (this._copyHtml.value && this.refs.copy) {
      replaceInnerHtml(this.refs.copy, this._copyHtml.value);
    }
  }
}
