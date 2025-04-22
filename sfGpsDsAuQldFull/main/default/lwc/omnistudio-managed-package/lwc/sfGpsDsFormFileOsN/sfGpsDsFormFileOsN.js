/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptFile from "omnistudio/omniscriptFile";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";
import { formatTemplate } from "c/sfGpsDsHelpersOs";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class extends SfGpsDsOmniHasValidationMixin(OmniscriptFile) {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get sfGpsDsIsError() {
    return this._showValidation;
  }

  get sfGpsDsErrorMessage() {
    return omniGetMergedField(this, this.errorMessage);
  }

  @api
  get validationMessage() {
    return this.errorMessage;
  }

  /* methods */

  setCustomValidation(message, report = true) {
    this._sfGpsDsCustomValidation = !!message;
    this.errorMessage = message;
    if (report) this.reportValidity();
  }

  /* Remove custom validation if file added or removed */

  notifyUploadChange(removedId, bFileDeleteSuccess) {
    this._sfGpsDsCustomValidation = false;
    this.errorMessage = "";

    super.notifyUploadChange(removedId, bFileDeleteSuccess);
  }

  /* Override to leverage configurable error message */

  reportValidity() {
    if (this._sfGpsDsCustomValidation) {
      this.isValid = false;
      this._showValidation = true;
    } else {
      this.isValid = this._propSetMap.required ? this._value.length > 0 : true;
      this._showValidation = !this.isValid;

      if (this._showValidation) {
        this.errorMessage = formatTemplate(this._messageWhenValueMissing, {
          0: this._propSetMap.label || "Field",
          label: this._propSetMap.label || "Field"
        });
      }
    }

    return this.isValid;
  }
}
