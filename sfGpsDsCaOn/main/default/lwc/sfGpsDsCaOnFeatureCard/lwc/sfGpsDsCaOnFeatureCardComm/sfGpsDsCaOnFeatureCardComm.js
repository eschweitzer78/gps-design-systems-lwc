/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * Experience Builder wrapper for Ontario DS Feature Card.
 */
export default class SfGpsDsCaOnFeatureCardComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  heading;

  // @ts-ignore
  @api
  description;

  // @ts-ignore
  @api
  url;

  // @ts-ignore
  @api
  image;

  // @ts-ignore
  @api
  imageAltText;

  // @ts-ignore
  @api
  headingLevel;

  // @ts-ignore
  @api
  imageSize;

  // Deprecated properties - kept for backwards compatibility
  // @ts-ignore
  @api
  aspectRatio;

  // @ts-ignore
  @api
  cardStyle;

  // @ts-ignore
  @api
  className;

  /* Lifecycle */
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
