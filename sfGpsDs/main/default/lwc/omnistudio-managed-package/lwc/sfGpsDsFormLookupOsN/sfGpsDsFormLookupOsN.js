/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptLookup from "omnistudio/omniscriptLookup";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

const THEME_IS_OPEN_CLASSNAME = "sfgpsds-is-open";
const THEME_HAS_FOCUS_CLASSNAME = "sfgpsds-has-focus";
const THEME_DD_TRIGGER_CLICK_SELECTOR = ".sfgpsds-dropdown-trigger_click";

const CLASS_NAME = "sfGpsDsFormLookupOsN";
const DEBUG = false;

export default class extends SfGpsDsOmniHasValidationMixin(OmniscriptLookup) {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get mergedPlaceholder() {
    return omniGetMergedField(this, this._propSetMap.placeholder);
  }

  get sfGpsDsIsError() {
    return this.hasError || this.sfGpsDsHasCustomValidation();
  }

  get sfGpsDsErrorMessage() {
    return omniGetMergedField(
      this.errorMessage || this.sfGpsDsGetCustomValidation()
    );
  }

  get computedOptions() {
    /* There is an oddity when options are set (in prefill) but generateUniqueAttributes() hasn't been called.
       And then there is neither key nor id, which is an issue to render the template...
       Looks like a bug to me. Let's cover for it.
    */
    return (this.options || []).map((item, index) => ({
      ...item,
      key: item.key || index,
      id: item.id || item.key || `option-${index}`
    }));
  }

  /* methods */

  /* override, we make sure the sfgpsds classes are added on showOptions as we can't change the theme on a Form object */
  showOptions() {
    let triggerEl = this.template.querySelector(
      THEME_DD_TRIGGER_CLICK_SELECTOR
    );
    if (triggerEl) {
      triggerEl.classList.add(THEME_IS_OPEN_CLASSNAME);
    }

    super.showOptions();

    if (this.selectedIndex === -1 || this._propSetMap.clearValue) {
      /* If nothing is selected then focus on the first entry */
      this.selectedIndex = -1;
      this.highlightIndex = -1;
      this.ariaFocus(null);
    }
  }

  /* override, we make sure the sfgpsds classes are removed on hideOptions as we can't change the theme on a Form object */
  hideOptions() {
    let triggerEl = this.template.querySelector(
      THEME_DD_TRIGGER_CLICK_SELECTOR
    );
    if (triggerEl) {
      triggerEl.classList.remove(THEME_IS_OPEN_CLASSNAME);
    }

    super.hideOptions();
  }

  /* override, why does omnistudio use event.target when you should do event.currentTarget? */
  selectOption(event) {
    let attr = event.currentTarget.getAttribute("data-option-index");
    const inputIndex = parseInt(attr, 10);
    this.setSelected(inputIndex);
    this.hideOptions();
  }

  /* overriding parent to have smooth scrollInto on focus, also use currentTarget vs target 
     we also make the current index the highlight index, otherwise end users could be
     flustered when moving from mouse to keyboard */

  mouseOverFocus(event) {
    this.highlightIndex = event.currentTarget.getAttribute("data-option-index");
    this.ariaFocus(this.highlightIndex, true);
  }

  /**
   * we make sure the sfgpsds classes are added on focus as we can't change the theme on a Form object
   * the original method is short, so we totally override it vs extending.
   */

  ariaFocus(newIndex, isHover = false) {
    const options = this.template.querySelectorAll('[role="option"]');

    options.forEach((opt) => {
      opt.classList.remove(THEME_HAS_FOCUS_CLASSNAME);
    });

    if (newIndex != null && options[newIndex]) {
      const option = options[newIndex];
      option.classList.add(THEME_HAS_FOCUS_CLASSNAME);
      this._inputRef.setAttribute("aria-activedescendant", option.id);

      /* scroll into view if keyboard event */
      if (option.scrollIntoView && !isHover) {
        option.scrollIntoView({
          block: "nearest"
        });
      }
    } else if (options.length) {
      if (options[0].scrollIntoView && !isHover) {
        options[0].scrollIntoView({
          block: "nearest"
        });
      }
    }
  }

  /* clear custom validation when changing the value */

  setSelected(selectedIndex) {
    if (this._hasCustomError) {
      this._hasCustomError = false;
      this._errorMessage = "";
    }

    return super.setSelected(selectedIndex);
  }

  // override
  @api setCustomValidation(message, report = true) {
    this._hasCustomError = !!message;
    this.errorMessage = message;
    if (report) this.reportValidity();
  }

  // overide
  @api sfGpsDsHasCustomValidation() {
    const rv = this._hasCustomError;
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsHasCustomValidation", rv);
    return rv;
  }

  // override
  @api sfGpsDsClearCustomValidation(report = true) {
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsClearCustomValidation");

    if (this._hasCustomError) {
      this.setCustomValidation("", report);
    }
  }

  @api
  get validationMessage() {
    return omniGetMergedField(this, this.errorMessage);
  }
}
