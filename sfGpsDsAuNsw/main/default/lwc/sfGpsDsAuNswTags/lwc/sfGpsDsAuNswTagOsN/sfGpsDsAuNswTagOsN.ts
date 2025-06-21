/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElementOs from "c/sfGpsDsElementOs";

export default 
class SfGpsDsAuNswTagOsN
extends SfGpsDsElementOs {
  // @ts-ignore
  @api 
  url?: string;

  // @ts-ignore
  @api 
  text?: string;

  // @ts-ignore
  @api 
  tagClassName?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-list": true,
      "nsw-list-8": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedTagClassName(): any {
    return {
      "nsw-tag": true,
      [this.tagClassName || ""]: !!this.tagClassName
    };
  }
}
