/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswCallout extends LightningElement {
  @api title;
  @api level = 4;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-callout": true,
      [this.className]: this.className
    });
  }

  get isH1() {
    return this.level === 1;
  }

  get isH2() {
    return this.level === 2;
  }

  get isH3() {
    return this.level === 3;
  }

  get isH4() {
    return this.level === 4;
  }

  get isH5() {
    return this.level === 5;
  }

  get isH6() {
    return this.level === 6;
  }
}
