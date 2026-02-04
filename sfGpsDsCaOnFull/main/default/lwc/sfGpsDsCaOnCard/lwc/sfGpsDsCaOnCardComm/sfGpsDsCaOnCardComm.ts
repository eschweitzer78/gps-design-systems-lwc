/*
* Copyright (c) 2025, Emmanuel Schweitzer, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api
} from "lwc";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnCardComm";

/**
 * @slot Card-Description
 */
export default 
class SfGpsDsCaOnCardComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  ariaLabelText?: string;

  // @ts-ignore
  @api 
  description?: string;
  _descriptionHtml = this.defineMarkdownContentProperty("description", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Description markdown"
  });

  // @ts-ignore
  @api 
  heading = "";
  _heading = this.defineMarkdownFirstLinkProperty("heading", {
    errorCode: "HE-MD",
    errorText: "Issue when parsing Heading markdown"
  });

  // @ts-ignore
  @api 
  headingColour?: string;

  // @ts-ignore
  @api 
  headingLevel?: string;

  // @ts-ignore
  @api
  hideDescription?: boolean;

  // @ts-ignore
  @api 
  horizontalImagePosition?: string;

  // @ts-ignore
  @api 
  horizontalImageSize?: string;

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAltText?: string;

  // @ts-ignore
  @api 
  layoutDirection?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* getters */

  get computedHasDescription() {
    return !this.hideDescription;
  }
  
  get _headingText(): string | undefined {
    return this._heading.value?.text;
  }

  get _headingUrl(): string | undefined {
    return this._heading.value?.url;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }

  renderedCallback() {
    if (DEBUG) console.debug(CLASS_NAME, "> renderedCallback", this.refs.description);
    super.renderedCallback?.();

    if (this.refs.description) {
      replaceInnerHtml(this.refs.description, this._descriptionHtml.value);
    if (DEBUG) console.debug(CLASS_NAME, "= renderedCallback", this._descriptionHtml.value);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< renderedCallback");
  }
}
