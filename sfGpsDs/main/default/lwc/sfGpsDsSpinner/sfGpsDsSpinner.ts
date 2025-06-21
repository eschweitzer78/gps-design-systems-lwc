/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import type * as CSS from "csstype";
import type { 
  StyleElement 
} from "c/sfGpsDsSpinner";

export default 
class SfGpsDsSpinner 
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  animationDuration: number = 1250;
  // @ts-ignore
  @api 
  size: number = 65;
  // @ts-ignore
  @api 
  squaresNum: number = 4;
  // @ts-ignore
  @api 
  color: string = "#555";

  /* computed */

  get computedSquareStyle(): CSS.Properties {
    return {
      height: `${(this.size * 0.25) / 1.3}px`,
      width: `${(this.size * 0.25) / 1.3}px`,
      animationDuration: `${this.animationDuration}ms`,
      borderWidth: `${(this.size * 0.04) / 1.3}px`,
      borderColor: this.color
    };
  }

  get computedSquaresStyles(): StyleElement[] {
    let squaresStyles: StyleElement[] = [];

    for (let i = 1; i <= this.squaresNum; i++) {
      squaresStyles.push({
        style: this.computedSquareStyle,
        index: i
      });
    }

    return squaresStyles;
  }
}
