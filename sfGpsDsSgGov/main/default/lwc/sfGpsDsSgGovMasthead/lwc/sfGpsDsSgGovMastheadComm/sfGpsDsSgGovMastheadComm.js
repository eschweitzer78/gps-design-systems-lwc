/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api label;
  @api fluid;
  @api className;

  @track _toggleVisibility;

  /* getters */

  get computedMastheadClassName() {
    return {
      "sgds-masthead": true,
      [this.className]: this.className
    };
  }

  get computedContainerClassName() {
    return {
      container: !this.fluid,
      "container-fluid": this.fluid
    };
  }

  get computedSvgClassName() {
    return {
      "sgds-masthead-identify-icon": true,
      show: this._toggleVisibility
    };
  }

  get computedContentClassName() {
    return {
      container: true,
      "sgds-masthead-content": true,
      show: this._toggleVisibility
    };
  }

  /* event management */

  handleToggleVisibility() {
    this._toggleVisibility = !this._toggleVisibility;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("sggov-scope");
  }
}
