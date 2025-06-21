/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {  
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";

export default 
class SfGpsDsMarkupComm
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  markup?: string;

  // @ts-ignore
  @api 
  className?: string;

  renderedCallback() {
    super.renderedCallback?.();
    
    if (this.refs.markup)
      replaceInnerHtml(this.refs.markup, this.markup || "");
  }
}
