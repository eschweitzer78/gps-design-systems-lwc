/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api animationDuration = 1250;
  @api size = 65;
  @api squaresNum = 4;
  @api color = "#555";

  /* computed */

  get computedSquareStyle() {
    return {
      height: `${(this.size * 0.25) / 1.3}px`,
      width: `${(this.size * 0.25) / 1.3}px`,
      animationDuration: `${this.animationDuration}ms`,
      borderWidth: `${(this.size * 0.04) / 1.3}px`,
      borderColor: this.color
    };
  }

  get computedSquaresStyles() {
    let squaresStyles = [];

    for (let i = 1; i <= this.squaresNum; i++) {
      squaresStyles.push({
        style: this.computedSquareStyle,
        index: i
      });
    }

    return squaresStyles;
  }
}
