/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

const defaultTitle = "There is no data";

export default class SfGpsDsEmpty extends LightningElement {
  @api title = defaultTitle;
  @api content;
}
