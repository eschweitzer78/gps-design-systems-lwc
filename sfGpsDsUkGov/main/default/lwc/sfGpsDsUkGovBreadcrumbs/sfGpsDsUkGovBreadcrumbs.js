/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsUkGovBreadcrumbs extends LightningElement {
  static renderMode = "light";

  @api items = [];
  @api className;

  /* api: collapseOnMobile */

  _collapseOnMobile = true;

  @api
  get collapseOnMobile() {
    return this._collapseOnMobile;
  }

  set collapseOnMobile(value) {
    this._collapseOnMobile = value;
  }

  get computedClassName() {
    return computeClass({
      "govuk-breadcrumbs": true,
      "govuk-breadcrumbs--collapse-on-mobile": this.collapseOnMobile,
      [this.className]: this.className
    });
  }
}
