/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from 'lwc';

export default class SfGpsDsAuNswBreadcrumbs extends LightningElement {
  @api label;
  @api linkComponent = 'a';
  @api className = '';
  @api items = [];

  get computedClassName() {
    return `nsw-breadcrumbs ${this.className}`;
  }

  get computedListClassName() {
    return `nsw-breadcrumb__list nsw-breadcrumb__list--inline`;
  }
}
