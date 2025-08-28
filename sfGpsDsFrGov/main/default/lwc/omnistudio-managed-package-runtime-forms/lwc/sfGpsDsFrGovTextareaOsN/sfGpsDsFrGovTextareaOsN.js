/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTextarea from "c/sfGpsDsOmniTextareaOsN";
import {
  computeClass,
  normaliseBoolean,
  formatTemplate
} from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovTextareaOsN.html";

const CHAR_LIMIT_REMAINING_TMPL = "{charRemaining} caractères restants";
const CHAR_LIMIT_CHARACTERS_TMPL = "{charCount} caractères";

const SHOW_CHARACTER_COUNT_DEFAULT = true;
const SHOW_CHARACTER_COUNT_FALLBACK = false;

export default class extends OmnistudioTextarea {
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
      "fr-input-group": true,
      "fr-input-group--error": this.sfGpsDsIsError,
      "fr-input-group--disabled":
        this.readOnly || (this.isInput && this.readOnly)
    };
  }

  get computedTextAreaClassName() {
    return {
      "fr-input": true
    };
  }

  get computedCharacterCountClassName() {
    return {
      "fr-hint-text": true,
      "fr-error-text": this.sfGpsDsIsError
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

  get _errorMessage() {
    return this.sfGpsDsErrorMessage?.replace("Error:", "");
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
