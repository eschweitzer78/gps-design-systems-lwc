/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTextarea from "c/sfGpsDsOmniTextareaOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import {
  computeClass,
  normaliseBoolean,
  formatTemplate
} from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTextareaOsN.html";

const CHAR_LIMIT_REMAINING_TMPL = "{charRemaining} characters remaining";
const CHAR_LIMIT_CHARACTERS_TMPL = "{charCount} characters";

const SHOW_CHARACTER_COUNT_DEFAULT = true;
const SHOW_CHARACTER_COUNT_FALLBACK = true;

export default class extends SfGpsDsUkGovLabelMixin(OmnistudioTextarea) {
  /* obsolete */
  @api characterLimit;

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

  /* api: showCharacterCount */

  _showCharacterCount = SHOW_CHARACTER_COUNT_DEFAULT;
  _showCharacterCountOriginal = SHOW_CHARACTER_COUNT_DEFAULT;

  @api
  get showCharacterCount() {
    return this._showCharacterCountOriginal;
  }

  set showCharacterCount(value) {
    this._showCharacterCountOriginal = value;
    this._showCharacterCount = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOW_CHARACTER_COUNT_FALLBACK
    });
  }

  /* computed */

  get computedFormGroupClassName() {
    return {
      "govuk-form-group": true,
      "govuk-form-group--error": this.sfGpsDsIsError
    };
  }

  get computedTextAreaClassName() {
    return {
      "govuk-textarea": true,
      "govuk-js-character-count": this._showCharacterCount,
      "govuk-textarea--error": this.sfGpsDsIsError
    };
  }

  get computedCharacterCountErrorClassName() {
    return {
      "govuk-character-count__message": true,
      "govuk-character-count__status ": true,
      "govuk-hint": true,
      "govuk-error-message": this.sfGpsDsIsError
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      "character-count-text": this._showCharacterCount,
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
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

  /* event management */

  handleKeyUp(event) {
    let charCount = event.target.value ? event.target.value.length : 0;

    if (this.maxLength == null || charCount <= this.maxLength) {
      this.value = event.target.value;
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
