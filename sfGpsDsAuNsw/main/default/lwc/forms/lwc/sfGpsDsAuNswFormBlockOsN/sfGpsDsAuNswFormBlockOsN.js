/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
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

  get computedClassName() {
    return {
      "nsw-accordion": true,
      ready: true,
      "non-collapsible": this._propSetMap.nonCollapsible,
      [this._propSetMap.className]: this._propSetMap.className
    };
  }

  get computedButtonClassName() {
    return {
      "nsw-accordion__button": true,
      active: this.expandContent
    };
  }

  get computedContentClassName() {
    return {
      "nsw-accordion__content": true,
      [this._propSetMap.contentClassName]: this._propSetMap.contentClassName
    };
  }

  get computedCollapsible() {
    return this._propSetMap.nonCollapsible ? false : true;
  }

  /* methods */

  toggleContent() {
    /* There is actually not a lot of clever or required stuff that the original method does:
      In 252.9 it:
      - prevents the click event default behaviour 
      - has a funny way of calling collapse on any contained omniscript*block elements
      - sets aria-hidden which is not required (aria-hidden is only to be used when the panel is visually still visible)
      - handles expandContent and ariaHiddenValue (and that's really the only bit we require her) + showValidation
      - focuses on the button (but we clicked on it right now and already have it)
      - fiddles with the block classes which we already manage anyway.
    */

    this.expandContent = !this.expandContent;
    this.ariaHiddenValue = !this.ariaHiddenValue;

    if (this.expandContent) {
      this.showValidation = false;
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
