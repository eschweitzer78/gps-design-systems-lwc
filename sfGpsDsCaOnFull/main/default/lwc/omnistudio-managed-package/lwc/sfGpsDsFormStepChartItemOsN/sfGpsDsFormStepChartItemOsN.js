/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptStepChartItems from "omnistudio/omniscriptStepChartItems";

export default class extends OmniscriptStepChartItems {
  /* computed */

  // issue #399
  get computedTabindex() {
    return this.jsonDef.indexInParent < this.currentIndex ? "0" : null;
  }

  get computedRole() {
    return this.jsonDef.indexInParent < this.currentIndex
      ? "button"
      : "presentation";
  }
  // end issue #399

  /* event management */

  handleStepClick() {
    /* Original code used preventDefault when it's not really required */

    /* Original code used event-target and a data attribute, which is not 
       very sensible as itcould very well be any descendent element that may 
       not have the data-index attribute. Also the data attribute is not
       required.
    */
    // gets index of selected step
    const selectedIndex = this.jsonDef.indexInParent;

    // prevents click navigation to future steps
    if (selectedIndex < this.currentIndex) {
      this.dispatchEvent(
        new CustomEvent("omnistepchart", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            currIndex: selectedIndex,
            prevIndex: this.currentIndex
          }
        })
      );
    }
  }

  // issue #399
  handleStepKeydown(event) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.handleStepClick();
    }
  }
  // end issue #399
}
