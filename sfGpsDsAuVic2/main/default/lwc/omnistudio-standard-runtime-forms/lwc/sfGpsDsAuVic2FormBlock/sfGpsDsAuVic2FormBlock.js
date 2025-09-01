/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormBlock from "c/sfGpsDsFormBlock";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuVic2FormBlock.html";

export default class extends SfGpsDsAuVic2FormElementMixin(
  SfGpsDsFormBlock,
  false
) {
  /* computed */

  get computedClassName() {
    return {
      "rpl-accordion": true,
      "non-collapsible": this._propSetMap.nonCollapsible,
      "non-indented": this._propSetMap.nonIndented,
      [this._propSetMap.className]: this._propSetMap.className
    };
  }

  get computedItemClassName() {
    return {
      "rpl-accordion__item": true,
      "rpl-accordion__item--active": this.expandContent
    };
  }

  get computedButtonClassName() {
    return {
      "rpl-accordion__item-toggle rpl-u-focusable-block": true
    };
  }

  get computedContentClassName() {
    return computeClass({
      "rpl-accordion__item-content": this.computedCollapsible,
      [this._propSetMap.contentClassName]: this._propSetMap.contentClassName
    });
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
