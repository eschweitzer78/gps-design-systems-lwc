/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswSkipTo extends LightningElement {
  static renderMode = "light";

  @api arLabel = "Skip to links";
  @api nav;
  @api navLabel = "Skip to navigation";
  @api content;
  @api contentLabel = "Skip to content";
  @api cstyle = "default";
  @api className;

  get computedSkipClassName() {
    return computeClass({
      "nsw-skip": true,
      "nsw-skip--light": this.cstyle === "light"
    });
  }

  get computedMastheadClassName() {
    return computeClass({
      "nsw-masthead": true,
      "nsw-masthead--light": this.cstyle === "light",
      [this.className]: this.className
    });
  }
}
