/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormBlock from "c/sfGpsDsFormBlock";
import tmpl from "./sfGpsDsCaOnFormBlock.html";

/**
 * @slot Block
 * @description Ontario Design System Block (accordion) for OmniStudio forms.
 * Uses Ontario accordion pattern for collapsible content sections.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses accordion pattern from Ontario DS
 * - WCAG 2.1 AA: Proper ARIA attributes for accordion pattern
 */
export default class SfGpsDsCaOnFormBlock extends SfGpsDsFormBlock {
  /* computed */

  get computedClassName() {
    let classes = "ontario-accordion sfgpsdscaon-block";
    if (this._propSetMap?.className) {
      classes += ` ${this._propSetMap.className}`;
    }
    return classes;
  }

  get computedButtonClassName() {
    let classes = "ontario-accordion__button";
    if (this.expandContent) {
      classes += " ontario-accordion--open";
    }
    return classes;
  }

  get computedContentClassName() {
    let classes = "ontario-accordion__content";
    if (this._propSetMap?.contentClassName) {
      classes += ` ${this._propSetMap.contentClassName}`;
    }
    return classes;
  }

  get computedCollapsible() {
    return !this._propSetMap?.nonCollapsible;
  }

  get computedIsH3Heading() {
    return (this._propSetMap?.headingLevel || 3) === 3;
  }

  get showValidationError() {
    return this.showValidation && this.allCustomLabelsUtil?.OmniBlockError;
  }

  get addAriaLabel() {
    return `Add ${this.mergedLabel || "block"}`;
  }

  get removeAriaLabel() {
    return `Remove ${this.mergedLabel || "block"}`;
  }

  /* methods */

  toggleContent() {
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

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.classList.add("caon-scope");
  }
}
