/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnActionCardCollectionLwr";

/**
 * @slot ActionCards
 * @description Ontario Design System Action Card Collection for Experience Builder.
 *
 * Grid container for Action Cards. Automatically arranges cards in a responsive grid.
 *
 * Example usage:
 * - Permission selection pages ("Apply or Register")
 * - Service catalog grids
 *
 * Place sfGpsDsCaOnActionCardLwr components inside this collection.
 */
export default class SfGpsDsCaOnActionCardCollectionLwr extends SfGpsDsLwc {
  static renderMode = "light";

  /**
   * Number of cards to display per row on desktop
   */
  @api cardsPerRow = "3";

  /**
   * Additional CSS class
   */
  @api className;

  /* computed */

  get computedClassName() {
    return computeClass({
      "sfgpsdscaon-action-card-collection": true,
      [`sfgpsdscaon-action-card-collection--${this.cardsPerRow}-per-row`]:
        this.cardsPerRow,
      [this.className]: this.className
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }
}
