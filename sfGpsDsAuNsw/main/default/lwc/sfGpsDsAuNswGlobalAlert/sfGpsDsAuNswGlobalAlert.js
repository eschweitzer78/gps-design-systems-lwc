/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from 'lwc';

const options = {
  default: '',
  critical: 'nsw-global-alert--critical',
  light: 'nsw-global-alert--light',
};

const buttonStyles = {
  default: 'nsw-button nsw-button--white',
  critical: 'nsw-button nsw-button--white',
  light: 'nsw-button nsw-button--dark',
};

export default class SfGpsDsAuNswGlobalAlert extends LightningElement {
  @api title;
  @api content;
  @api ctaText;
  @api ctaHref;
  @api ctaStyle = 'link'; // link or button
  @api as = 'default';
  @api className;
  @track _isClosed;

  get space() {
    return ' ';
  }

  get computedClassName() {
    return `nsw-global-alert ${this.className ? this.className : ''} ${
      options[this.as]
    }`;
  }

  get computedButtonClassName() {
    return this.as ? buttonStyles[this.as] : buttonStyles.default;
  }

  get hasCta() {
    return this.ctaText && this.ctaHref;
  }

  get isCtaLinkStyle() {
    return this.ctaStyle === 'link';
  }

  get isCtaButtonStyle() {
    return this.ctaStyle === 'button';
  }

  handleClick() {
    this._isClosed = true;
  }
}
