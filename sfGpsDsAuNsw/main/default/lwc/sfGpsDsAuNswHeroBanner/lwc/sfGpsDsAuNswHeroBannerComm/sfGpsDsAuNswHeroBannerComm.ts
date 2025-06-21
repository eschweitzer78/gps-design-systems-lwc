/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import type { BannerImage, CStyle } from "c/sfGpsDsAuNswHeroBanner";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswHeroBannerComm";

export default 
class sfGpsDsAuNswHeroBannerComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  subtitle?: string;

  // @ts-ignore
  @api 
  cstyle?: CStyle;

  // @ts-ignore
  @api 
  wide?: boolean;

  // @ts-ignore
  @api 
  featured?: boolean;

  // @ts-ignore
  @api 
  lines?: boolean;

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  cta?: string;
  _cta = this.defineMarkdownFirstLinkProperty("cta", {
    errorCode: "CT-MD",
    errorText: "Issue when parsing Call to action markdown"
  });

  // @ts-ignore
  @api
  links?: string;
  _links = this.defineMarkdownLinksProperty("links", {
    errorCode: "LI-MD",
    errorText: "Issue when parsing Links markdown"
  });

  // @ts-ignore
  @api
  intro?: string;
  _introHtml = this.defineMarkdownContentProperty("intro", {
    errorCode: "IN-MD",
    errorText: "Issue when parsing Intro markdown"
  });

  /* computed */

  get computedImage(): BannerImage | null {
    return this.image 
      ? { 
          src: this.image, 
          alt: this.imageAlt 
        } 
      : null;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (
      this._introHtml.value && 
      this.refs.markdown
    ) {
      replaceInnerHtml(this.refs.markdown, this._introHtml.value);
    }
  }
}
