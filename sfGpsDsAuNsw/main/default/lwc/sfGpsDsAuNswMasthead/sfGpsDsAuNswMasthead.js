/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const skipOptions = {
  light: "nsw-skip--light",
  default: ""
};

const mastheadOptions = {
  light: "nsw-masthead--light",
  default: ""
};

export default class SfGpsDsAuNswSkipTo extends LightningElement {
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
      [skipOptions[this.cstyle] || skipOptions.default]: true
    });
  }

  get computedMastheadClassName() {
    return computeClass({
      "nsw-masthead": true,
      [mastheadOptions[this.cstyle] || mastheadOptions.default]: true,
      [this.className]: this.className
    });
  }
}
