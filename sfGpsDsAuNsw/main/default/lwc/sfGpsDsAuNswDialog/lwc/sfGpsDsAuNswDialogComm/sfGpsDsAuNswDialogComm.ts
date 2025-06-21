/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";

import type { 
  BStyle 
} from "c/sfGpsDsAuNswDialog";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswDialogComm";

export default 
class SfGpsDsAuNswDialogComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  primaryButtonText?: string;

  // @ts-ignore
  @api 
  secondaryButtonText?: string;

  // @ts-ignore
  @api 
  bstyle?: BStyle; // one of dark, danger

  // @ts-ignore
  @api 
  isDismissible: boolean = false;
  
  // @ts-ignore
  @api 
  className?: string;

  _isOpen: boolean = false;

  // @ts-ignore
  @api
  content?: string;
  _contentHtml = this.defineMarkdownContentProperty("content", {
    errorCode: "IN-MD",
    errorText: "Issue when parsing Content markdown."
  });

  /* computed */

  get computedButtonLabel(): string {
    return `Open ${this.title}`;
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleClick(
    _event: MouseEvent
  ): void {
    this._isOpen = true;
  }

  // eslint-disable-next-line no-unused-vars
  handleDismissed(
    _event: CustomEvent
  ): void {
    this._isOpen = false;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this._contentHtml.value && this.refs.markdown) {
      replaceInnerHtml(this.refs.markdown, this._contentHtml.value);
    }
  }
}
