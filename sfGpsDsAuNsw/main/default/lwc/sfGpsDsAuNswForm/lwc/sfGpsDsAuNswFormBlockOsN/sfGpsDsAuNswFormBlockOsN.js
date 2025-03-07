/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormBlockOsN from "c/sfGpsDsFormBlockOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import tmpl from "./sfGpsDsAuNswFormBlockOsN.html";

export default class extends SfGpsDsAuNswStatusHelperMixin(
  SfGpsDsFormBlockOsN
) {
  /* computed */

  get computedButtonClassName() {
    return {
      "nsw-accordion__button": true,
      active: this.expandContent
    };
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
