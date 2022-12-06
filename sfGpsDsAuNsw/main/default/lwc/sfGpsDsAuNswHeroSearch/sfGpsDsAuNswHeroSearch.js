/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswHeroSearch extends LightningElement {
  @api title;
  @api intro;
  @api image;
  @api links;
  @api className;
  @api value = ""; // ADJUSTED: added value public attribute

  @api srLabel = "Search site for:";
  @api srSearchButtonLabel = "Search";

  get computedSectionStyle() {
    return this.image ? `background-image: url(${this.image});` : "";
  }

  get computedClassName() {
    return computeClass({
      "hero-search": true,
      [this.className]: this.className
    });
  }

  handleChange(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = event.target.value;
  }

  handleKeyUp(event) {
    const isEnterKey = event.keyCode === 13;
    if (isEnterKey) {
      this.dispatchEvent(new CustomEvent("search"));
    }

    return false; // avoid submission of form
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("search"));
  }
}
