/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioStepChartItem from "c/sfGpsDsFormStepChartItem";
import tmpl from "./sfGpsDsAuNswFormStepChartItem.html";

export default class extends OmnistudioStepChartItem {
  /* lifecycle */

  render() {
    return tmpl;
  }

  /* computed */

  get computedIsLast() {
    return this.jsonDef.indexInParent === this.lastStepIndex;
  }

  // override

  applyLightningStyles() {}

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-steps__item");
  }

  renderedCallback() {
    if (this.completed) {
      this.classList.add("nsw-steps__item--fill");
    } else {
      this.classList.remove("nsw-steps__item--fill");
    }
  }
}
