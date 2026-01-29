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
  heading?: string;

  // @ts-ignore
  @api
  description?: string;

  // @ts-ignore
  @api
  url?: string;

  // @ts-ignore
  @api
  image?: string;

  // @ts-ignore
  @api
  imageAltText?: string;

  // @ts-ignore
  @api
  headingLevel?: string;

  // @ts-ignore
  @api
  imageSize?: string;

  // @ts-ignore
  @api
  className?: string;

  /* Lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
