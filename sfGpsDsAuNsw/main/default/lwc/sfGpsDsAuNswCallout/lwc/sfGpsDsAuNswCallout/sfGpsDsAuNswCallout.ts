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

const LEVEL_MIN = 1;
const LEVEL_MAX = 6;
const LEVEL_DEFAULT = 4;

const FIRSTCHILD_DEFAULT = false;

export default 
class SfGpsDsAuNswCallout 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title: string = "";
  
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  // @ts-ignore
  firstChild?: boolean;
  _firstChild = this.defineBooleanProperty("firstChild", {
    defaultValue: FIRSTCHILD_DEFAULT
  });

  // @ts-ignore
  @api
  level?: number;
  _level = this.defineIntegerProperty("level", {
    minValue: LEVEL_MIN,
    maxValue: LEVEL_MAX,
    defaultValue: LEVEL_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-callout": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedTitleClassName(): any {
    return `nsw-h${this._level.value}`;
  }
}
