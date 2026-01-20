/*
 * Copyright (c) 2026, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptEditBlockNew from "c/sfGpsDsOsrtOmniscriptEditBlockNew";

import tmpl from "./sfGpsDsAuNswFormEditBlockNew.html";

export default class extends OmniscriptEditBlockNew {
  render() {
    return tmpl;
  }

  connectedCallback() {
    super.connectedCallback();

    this.classList.remove(`${this._theme}-large-size_3-of-12`);
    this.classList.remove(`${this._theme}-medium-size_6-of-12`);
    this.classList.remove(`${this._theme}-small-size_1-of-1`);
    this.classList.remove(`${this._theme}-m-bottom_xx-small`);
    this.classList.remove(`${this._theme}-p-right_small`);

    this.classList.add(
      "nsw-col-sm-12",
      "nsw-col-md-6",
      "nsw-col-lg-3",
      "nsw-m-right-sm",
      "nsw-m-bottom-sm"
    );
  }
}
