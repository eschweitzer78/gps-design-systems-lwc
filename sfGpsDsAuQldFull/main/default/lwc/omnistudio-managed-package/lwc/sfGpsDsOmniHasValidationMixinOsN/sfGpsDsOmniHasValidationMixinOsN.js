/*
 * Copyright (c) 2023 Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";

const ERROR_PROP_NAMES = [
  "messageWhenValueMissing",
  "messageWhenTooShort",
  "messageWhenTooLong",
  "messageWhenBadInput",
  "messageWhenRangeOverflow",
  "messageWhenRangeUnderflow",
  "messageWhenStepMismatch",
  "messageWhenTypeMismatch",
  "messageWhenMaskIncomplete"
];
// Note: messageWhenPatternMismatch is already configurable through the ptrnErrText prop */

/***
 * This solves an issue when overriding an input element template, in particular when setErrors is used
 * and the input element in the template do not generate a focus out, which is the only one type
 * of event that omnistudio clears custom validation errors for originally. See details below.
 */

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniHasValidationMixin";

const SfGpsDsOmniHasValidationMixin = (Base) =>
  class extends Base {
    initCompVariables() {
      super.initCompVariables();

      ERROR_PROP_NAMES.forEach((item) => {
        let propSetValValue = this._propSetMap[item];
        if (propSetValValue) {
          this[`_${item}`] = propSetValValue;
        } else {
          // Remove Error: prefix from error messages
          this[`_${item}`] = this[`_${item}`]?.replace(
            this.allCustomLabelsUtil.OmniErrorPrefix,
            ""
          );
        }
      });
    }

    /***
     * override
     ***/

    _sfGpsDsCustomValidation = false;

    setCustomValidation(message, report = true) {
      /***
       *
       * Overrides omniscriptValidation.setCustomValidation, which any Omnistudio Form
       * element is a Mixin of.
       *
       * We follow a different approach compared to OmniStudio original code which
       * sets custom validity, reports validity so it has a visual representation and
       * then attaches an event listener on the template for a focusout.
       *
       * That wasn't too good as more often than no a user would change the offending
       * value by keyboard or click without triggering a blur/focusout (with still the
       * custom validation having that visual effect... and then they hit
       * the next button.
       *
       * This would trigger a focusout and a call to the listener, clearing the custom
       * validation, reporting validity again, which would remove the graphical cues
       * for the error.
       *
       * Standard omnistudio had almost no change in size of the element in both valid and
       * invalid states, but if you come up with a different template and there are more
       * important variations, chances are it will lead to the cancellation of the click
       * event on the button as it moved away. Bummer.
       *
       * So our approach is actually to have elements systematically clear their custom
       * validation when they're interacted with, i.e. key or click so that if they're
       * otherwise valid, any error graphical cues would be removed right then, way before
       * the user has a change to move the mouse point and click on next.
       *
       * Note that the issue did not occur when users navigated away from the element
       * with the keyboard as focus out was eventually generated.
       *
       * We do it automatically for keyup as it's part of the OmniscriptValidation mixin
       * but when it comes to the change event, it's up to this mixin's base classes
       * to call setCustomValidation("") when dealing with a change, same with blur etc.
       *
       **/

      if (DEBUG) console.debug(CLASS_NAME, "> setCustomValidation", message);

      if (this.childInput && this.childInput.setCustomValidation) {
        this.childInput.setCustomValidation(message);
        this._sfGpsDsCustomValidation = !!message;
        if (report) this.reportValidity();
      } else {
        if (DEBUG)
          console.debug(
            CLASS_NAME,
            "setCustomValidation failed to set custom validation on child input"
          );
      }

      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "< setCustomValidation",
          "_sfGpsDsCustomValidation: " + this._sfGpsDsCustomValidation
        );
    }

    handleKeyup(event) {
      if (DEBUG) console.debug(CLASS_NAME, "handleKeyup");

      this.sfGpsDsClearCustomValidation(false);
      super.handleKeyup(event); // parent does reportValidity
    }

    @api sfGpsDsHasCustomValidation() {
      const rv = this._sfGpsDsCustomValidation;
      if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsHasCustomValidation", rv);
      return rv;
    }

    @api sfGpsDsClearCustomValidation(report = true) {
      if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsClearCustomValidation");

      if (this._sfGpsDsCustomValidation) {
        this.setCustomValidation("", report);
      }
    }
  };

export default SfGpsDsOmniHasValidationMixin;
