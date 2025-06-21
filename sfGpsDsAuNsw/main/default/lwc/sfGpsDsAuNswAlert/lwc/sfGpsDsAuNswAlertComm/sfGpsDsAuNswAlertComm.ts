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
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";
import type { 
  AlertType 
} from "c/sfGpsDsAuNswAlert";

const COMPACT_DEFAULT = false;

export default 
class SfGpsDsAuNswAlertComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  as: AlertType = "info";
  
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  compact?: boolean;
  _compact = this.defineBooleanProperty("compact", {
    defaultValue: COMPACT_DEFAULT,
    watcher: () => this.generateContentHtml()
  }); 

  /* api: content */

  _contentHtml?: string;
  _contentOriginal?: string;

  // @ts-ignore
  @api 
  get content(): string | undefined {
    return this._contentOriginal;
  }

  set content(markdown: string) {
    this._contentOriginal = markdown;
    this.generateContentHtml();
  }

  /* methods */

  generateContentHtml(): void {
    try {
      if (this._contentOriginal) {
        this._contentHtml = this._compact.value
          ? mdEngine.renderEscapedUnpackFirstP(this._contentOriginal)
          : mdEngine.renderEscaped(this._contentOriginal);
      }
    } catch (e: any) {
      console.debug(e.toString());
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    /*
     * We have to add an empty span if there is a title to trigger the appropriate css for *+p and similar
     * as the react component would have one for the title in the same scope,
     * but here we have the title markup in a different css scope
     */

    if (this.refs.markdown) {
      replaceInnerHtml(
        this.refs.markdown,
        (this.title && !this._compact.value ? `<span></span>` : "") + this._contentHtml
      );
    }
  }
}
