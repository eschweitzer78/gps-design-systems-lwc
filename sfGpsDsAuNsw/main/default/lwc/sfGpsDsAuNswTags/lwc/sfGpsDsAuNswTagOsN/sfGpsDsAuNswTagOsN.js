/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api tagClassName;
  @api url;
  @api text;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "nsw-list": true,
      "nsw-list-8": true,
      [this.className]: this.className
    };
  }

  get computedTagClassName() {
    return {
      "nsw-tag": true,
      [this.tagClassName]: this.tagClassName
    };
  }
}
