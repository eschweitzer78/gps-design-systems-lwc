/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTextarea from "omnistudio/textarea";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import {
  computeClass,
  normaliseBoolean,
  formatTemplate
} from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTextareaOsN.html";

const CHAR_LIMIT_REMAINING_TMPL = "{charRemaining} characters remaining";
const CHAR_LIMIT_CHARACTERS_TMPL = "{charCount} characters";

export default class SfGpsDsUkGovTextareaOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioTextarea,
  "large"
) {
  @api characterLimitRemainingTemplate = CHAR_LIMIT_REMAINING_TMPL;

  get _characterLimitRemainingTemplate() {
    return this.characterLimitRemainingTemplate == null
      ? CHAR_LIMIT_REMAINING_TMPL
      : this.characterLimitRemainingTemplate;
  }

  @api characterLimitCharactersTemplate = CHAR_LIMIT_CHARACTERS_TMPL;

  get _characterLimitCharactersTemplate() {
    return this.characterLimitCharactersTemplate == null
      ? CHAR_LIMIT_CHARACTERS_TMPL
      : this.characterLimitCharactersTemplate;
  }

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
      "govuk-js-character-count": this._showCharacterCount,
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
      "character-count-text": this._showCharacterCount,
      helper: this.fieldLevelHelp,
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

      let values = {
        charRemaining: this.maxLength - charCount,
        charCount: charCount
      };
      return this.maxLength
        ? formatTemplate(this._characterLimitRemainingTemplate, values)
        : formatTemplate(this._characterLimitCharactersTemplate, values);
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

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
