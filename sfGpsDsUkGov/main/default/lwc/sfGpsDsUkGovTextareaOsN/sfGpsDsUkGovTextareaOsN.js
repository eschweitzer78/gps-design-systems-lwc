/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import OmnistudioTextarea from "omnistudio/textarea";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTextareaOsN.html";

export default class SfGpsDsUkGovTextareaOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioTextarea,
  "large"
) {
  @api characterLimit;

  _showCharacterCount = true;
  _showCharacterCountOriginal;

  @api get showCharacterCount() {
    return this._showCharacterCountOriginal;
  }

  set showCharacterCount(value) {
    this._showCharacterCountOriginal = value;
    this._showCharacterCount = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  @track displayCharacterLimit;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedTextAreaCharacterCountError() {
    return computeClass({
      "govuk-textarea": true,
      "govuk-js-character-count": true,
      "govuk-textarea--error": this.isError
    });
  }

  get computedCharacterCountError() {
    return computeClass({
      "govuk-character-count__message": true,
      "govuk-character-count__status ": true,
      "govuk-hint": true,
      "govuk-error-message": this.isError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      textarealabel: this._showCharacterCount,
      helper: this.fieldLevelHelp,
      "exceeding-characters-error": this.isError,
      errorMessageBlock: this.isError
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("govuk-scope");
  }

  get characterCountText() {
    if (this._showCharacterCount) {
      let charCount = this.value.length;
      // console.log("***showCount***", charCount, this.maxLength);
      return this.maxLength
        ? `${this.maxLength - charCount} characters remaining`
        : `${charCount} characters`;
    }

    return null;
  }

  handleKeyUp(event) {
    let charCount = event.target.value ? event.target.value.length : 0;

    if (this.maxLength == null || charCount <= this.maxLength) {
      this.value = event.target.value;
    }
  }

  // Introduce Error Summary Container
  @api getErrorDetails() {
    let elt = this.template.querySelector(".govuk-form-group");

    return elt
      ? {
          id: elt.id,
          errorMessage: this._errorMessage
        }
      : null;
  }

  @api scrollTo() {
    console.log("scrollTo called v2!");
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
