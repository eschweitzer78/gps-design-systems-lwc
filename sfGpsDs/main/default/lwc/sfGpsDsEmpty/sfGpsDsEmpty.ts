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

const DEFAULT_TITLE = "There is no data";

export default 
class SfGpsDsEmpty 
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  title: string = DEFAULT_TITLE;

  // @ts-ignore
  @api 
  content?: string;
}
