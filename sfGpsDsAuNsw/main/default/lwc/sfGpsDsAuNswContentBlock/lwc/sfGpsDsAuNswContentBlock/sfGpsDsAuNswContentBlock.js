/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api image;
  @api imageAlt;
  @api icon;
  @api mainLink;
  @api links = [];
  @api className;

  /* api: headline - deprecated, use title instead */

  @api
  get headline() {
    return this.title;
  }

  set headline(value) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.title = value;
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-content-block": true,
      [this.className]: this.className
    };
  }
}
