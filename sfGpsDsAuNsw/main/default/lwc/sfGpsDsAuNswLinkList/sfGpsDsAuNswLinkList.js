/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class SfGpsDsAuNswLinkList extends LightningElement {
  @api links;
  @api className;

  get computedClassName() {
    return `nsw-link-list__list ${this.className ? this.className : ""}`;
  }
}
