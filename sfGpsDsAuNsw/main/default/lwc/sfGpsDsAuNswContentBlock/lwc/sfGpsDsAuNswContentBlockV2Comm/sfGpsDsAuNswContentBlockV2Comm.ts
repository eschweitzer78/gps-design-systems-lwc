/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
 * TODO/THOUGHTS:
 *
 * Using SVG icons from Experience Builder is not optimal.
 * SVG Files could be on the larger side and we only have a single line text field.
 * CMS does not support SVG with the Image document type, except if it's an URL-based piece of content.
 * Could perhaps have an attribute letting the user decide if the img is to be rendered as nsw-content-block__image
 * or nsw-content-block__icon?
 *
 * In the meantime we tweaked the original markup to display a 96px Material icon.
 *
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswContentBlockV2Comm";

export default 
class SfGpsDsAuNswContentBlockV2Comm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  icon?: string;

  // @ts-ignore
  @api 
  className?: string;

  // This is not exposed in Experience Builder and is used by contentBlockCollectionComm
  // @ts-ignore
  @api 
  useMarkup = false;


  // @ts-ignore
  @api 
  links?: string;
  _links = this.defineMarkdownLinksProperty("links", {
    errorCode: "LI-MD",
    errorText: "Issue when parsing Links markdown"
  });

  // @ts-ignore
  @api 
  copy?: string;
  _copyHtml = this.defineMarkdownContentProperty("copy", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Copy markdown"
  });

  // @ts-ignore
  @api 
  mainLink?: string;
  _mainLink = this.defineMarkdownFirstLinkProperty("mainLink", {
    errorCode: "ML-MD",
    errorText: "Issue when parsing MainLink markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this._copyHtml.value && this.refs.markdown) {
      replaceInnerHtml(this.refs.markdown, this._copyHtml.value);
    }
  }
}
