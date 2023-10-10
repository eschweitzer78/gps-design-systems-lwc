/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
export default class SfGpsDsUkGovPanel extends LightningElement {
  @api headingLevel = 1;
  @api title;
  @api className;

  get isH1() {
    return (this.headingLevel || 1) === 1 || this.headingLevel === "1";
  }

  get isH2() {
    return this.headingLevel === 2 || this.headingLevel === "2";
  }

  get isH3() {
    return this.headingLevel === 3 || this.headingLevel === "3";
  }

  get isH4() {
    return this.headingLevel === 4 || this.headingLevel === "4";
  }

  get isH5() {
    return this.headingLevel === 5 || this.headingLevel === "5";
  }

  get isH6() {
    return this.headingLevel === 6 || this.headingLevel === "6";
  }

  get computedClassName() {
    return computeClass({
      "govuk-panel": true,
      "govuk-panel--confirmation": true,
      [this.className]: this.className
    });
  }
}
