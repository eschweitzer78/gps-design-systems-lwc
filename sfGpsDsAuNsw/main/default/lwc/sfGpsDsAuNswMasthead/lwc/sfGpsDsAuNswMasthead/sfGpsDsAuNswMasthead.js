/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const CSTYLE_DEFAULT = "default";
const CSTYLE_VALUES = {
  default: { skip: "", masthead: "" },
  light: { skip: "nsw-skip--light", masthead: "nsw-masthead--light" }
};

export default class extends LightningElement {
  static renderMode = "light";

  @api arLabel = "Skip to links";
  @api navLabel = "Skip to navigation";
  @api contentLabel = "Skip to content";
  @api content;
  @api nav;
  @api className;

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedSkipClassName() {
    return {
      "nsw-skip": true,
      [this._cstyle.skip]: this._cstyle.skip
    };
  }

  get computedMastheadClassName() {
    return {
      "nsw-masthead": true,
      [this._cstyle.masthead]: this._cstyle.masthead,
      [this.className]: this.className
    };
  }
}
