/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from 'lwc';

const skipOptions = {
  light: 'nsw-skip--light',
  default: '',
};

const mastheadOptions = {
  light: 'nsw-masthead--light',
  default: '',
};

export default class SfGpsDsAuNswSkipTo extends LightningElement {
  @api arLabel = 'Skip to links';
  @api nav;
  @api navLabel = 'Skip to navigation';
  @api content;
  @api contentLabel = 'Skip to content';
  @api cstyle = 'default';
  @api className;

  get computedSkipClassName() {
    return `nsw-skip ${skipOptions[this.cstyle]}`;
  }

  get computedMastheadClassName() {
    return `nsw-masthead ${mastheadOptions[this.cstyle]} ${
      this.className ? this.className : ''
    }`;
  }
}
