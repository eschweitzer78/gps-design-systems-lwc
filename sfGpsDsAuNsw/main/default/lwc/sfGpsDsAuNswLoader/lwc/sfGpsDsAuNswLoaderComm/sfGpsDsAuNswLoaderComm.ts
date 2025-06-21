/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  Size 
} from "c/sfGpsDsAuNswLoader";

export default 
class SfGpsDsAuNswLoaderComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  size?: Size;
  
  // @ts-ignore
  @api 
  className?: string;
}
