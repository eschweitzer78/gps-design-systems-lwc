/*
* Copyright (c) 2025, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { CardsPerRow } from "c/sfGpsDsCaOnCardCollectionLwr";

const CARDSPERROW_VALUES: CardsPerRow[] = [ "1", "2", "3", "4" ];
const CARDSPERROW_DEFAULT: CardsPerRow = "2"
/**
 * @slot Cards
 */
export default 
class SfGpsDsCaOnCardCollectionLwr 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  cardsPerRow?: string;
  _cardsPerRow = this.defineEnumProperty("cardsPerRow", {
    validValues: CARDSPERROW_VALUES,
    defaultValue: CARDSPERROW_DEFAULT
  });

  // @ts-ignore
  @api 
  className?: string;

  /* getters */

  get computedClassName(): any {
    return {
      "ontario-card-collection__container": true,
      [`ontario-card-collection--cards-per-row-${this._cardsPerRow.value}`]: this._cardsPerRow.value !== "1"
    }
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
