/*
* Copyright (c) 2025, Emmanuel Schweitzer, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Cards
 */
export default 
class SfGpsDsCaOnCardCollectionLwr 
extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api 
  cardsPerRow?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* getters */

  get computedClassName(): any {
    return {
      "ontario-card-collection__container": true,
      [`ontario-card-collection--cards-per-row-${this.cardsPerRow}`]: this.cardsPerRow !== "1",
      [this.className || ""]: this.className
    };
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
