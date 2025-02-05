/*
 * Copyright (c) 2023 Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniInputMixin";

const SfGpsDsOmniInputMixin = (Base) =>
  class extends Base {
    /***
     * @description Set Custom Validation on input
     * (Used by parent as a result of a set error action).
     ***/

    @api setCustomValidation(message) {
      if (DEBUG) console.log(CLASS_NAME, "> setCustomValidation", message);
      this._sfGpsDsCustomValidation = message;
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "< setCustomValidation",
          "_sfGpsDsCustomValidation: " + this._sfGpsDsCustomValidation
        );
    }

    _sfGpsDsCustomValidation = "";

    @api sfGpsDsHasCustomValidation() {
      const rv = !!this._sfGpsDsCustomValidation;
      if (DEBUG) console.log(CLASS_NAME, "sfGpsDsHasCustomValidation", rv);
      return rv;
    }

    @api sfGpsDsClearCustomValidation() {
      if (DEBUG) console.log(CLASS_NAME, "sfGpsDsClearCustomValidation");
      this._sfGpsDsCustomValidation = "";
    }

    @api sfGpsDsGetCustomValidation() {
      const rv = this._sfGpsDsCustomValidation;
      if (DEBUG) console.log(CLASS_NAME, "sfGpsDsGetCustomValidation", rv);
      return rv;
    }

    @api checkValidity() {
      const rv = this.sfGpsDsHasCustomValidation()
        ? false
        : super.checkValidity();
      if (DEBUG) console.log(CLASS_NAME, "checkValidity", rv);
      return rv;
    }

    @api reportValidity() {
      const srv = super.reportValidity();
      const rv = this.sfGpsDsHasCustomValidation() ? false : srv;
      if (DEBUG) console.log(CLASS_NAME, "reportValidity", rv);
      return rv;
    }

    @api
    get validity() {
      const hcv = this.sfGpsDsHasCustomValidation();
      const srv = super.validity;
      const rv = {
        /* spread operator isn't working */
        badInput: srv.badInput,
        customError: hcv || srv.customError,
        patternMismatch: srv.patternMismatch,
        rangeOverflow: srv.rangeOverflow,
        rangeUnderflow: srv.rangeUnderflow,
        stepMismatch: srv.stepMismatch,
        tooLong: srv.tooLong,
        tooShort: srv.tooShort,
        typeMismatch: srv.typeMismatch,
        valid: srv.valid && !hcv,
        valueMissing: srv.valueMissing
      };

      if (DEBUG) console.log(CLASS_NAME, "get validity", rv);
      return rv;
    }

    @api
    get validationMessage() {
      const svm = super.validationMessage;
      const rv = this.sfGpsDsGetCustomValidation() || svm;

      if (DEBUG) console.log(CLASS_NAME, "get validationMessage", rv);

      return rv;
    }

    get sfGpsDsIsError() {
      const rv = this.isError || this.sfGpsDsHasCustomValidation();
      if (DEBUG) console.log(CLASS_NAME, "get sfGpsDsIsError", rv);
      return rv;
    }

    get sfGpsDsErrorMessage() {
      return this.sfGpsDsGetCustomValidation() || this.errorMessage;
    }
  };

export default SfGpsDsOmniInputMixin;
