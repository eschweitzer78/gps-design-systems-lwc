/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from 'lwc';

export default class SfGpsDsAuNswAccordion extends LightningElement {
  @api header;
  @api className;

  @api get closed() {
    return !this.isOpen;
  }

  set closed(value) {
    this.isOpen = !value;
  }

  @track isOpen = false;

  get computedClassName() {
    return `nsw-accordion__title ${this.className ? this.className : ''}`;
  }

  get computedButtonClassName() {
    return `nsw-accordion__button ${this.isOpen ? 'active' : ''}`;
  }

  get computedIsHidden() {
    return this.isOpen ? '' : 'hidden';
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent(this.isOpen ? 'collapse' : 'expand'));
    this.isOpen = !this.isOpen;
  }
}
