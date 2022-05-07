/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from 'lwc';

export default class SfGpsDsAuNswButton extends LightningElement {
  @api link;
  @api cstyle; // oneOf(['dark', 'dark-outline', 'dark-outline-solid', 'light', 'light-outline','white','danger']
  @api type;
  @api block = false;
  @api className;
  @api label;

  get computedClassName() {
    return `nsw-button nsw-button--${this.cstyle}${
      this.block ? ' nsw-button--block' : ''
    }${this.className ? ' ' + this.className : ''}`;
  }

  handleClick() {
    const clickEvent = new CustomEvent('click');
    this.dispatchEvent(clickEvent);
  }
}
