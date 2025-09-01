/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTextarea from "c/sfGpsDsOmniTextarea";
import {
  computeClass,
  normaliseString,
  normaliseInteger,
  formatTemplate
} from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuVic2Textarea.html";

const VARIANT_DEFAULT = "default";
const VARIANT_VALUES = {
  default: "rpl-form__textarea--default",
  reverse: "rpl-form__textarea--reverse"
};

const COUNTERTYPE_NONE = "none";
const COUNTERTYPE_CHARACTER = "character";
const COUNTERTYPE_WORD = "word";
const COUNTERTYPE_VALUES = [
  COUNTERTYPE_NONE,
  COUNTERTYPE_CHARACTER,
  COUNTERTYPE_WORD
];
const COUNTERTYPE_DEFAULT = COUNTERTYPE_NONE;

const COUNTER_TOO_FEW_TMPL = "You have {tooFew} {unit} too few";
const COUNTER_TOO_MANY_TMPL = "You have {tooMany} {unit} too many";
const COUNTER_REGULAR_TMPL = "You have {length} {unit}";

const ROWS_DEFAULT = 4;
const ROWS_MIN = 1;
const ROWS_MAX = 40;

const pluralize = (count) => (!count || count > 1 ? "s" : "");

export default class extends OmnistudioTextarea {
  @api counterTooFewTemplate;
  @api counterTooManyTemplate;
  @api counterRegularTemplate;

  get _counterTooFewTemplate() {
    return this.counterTooFewTemplate || COUNTER_TOO_FEW_TMPL;
  }

  get _counterTooManyTemplate() {
    return this.counterTooManyTemplate || COUNTER_TOO_MANY_TMPL;
  }

  get _counterRegularTemplate() {
    return this.counterRegularTemplate || COUNTER_REGULAR_TMPL;
  }

  /* api: counter type */

  _counterType = COUNTERTYPE_DEFAULT;
  _counterTypeOriginal = COUNTERTYPE_DEFAULT;

  @api
  get counterType() {
    return this._counterTypeOriginal;
  }

  set counterType(value) {
    this._counterTypeOriginal = value;
    this._counterType = normaliseString(value, {
      validValues: COUNTERTYPE_VALUES,
      fallbackValue: COUNTERTYPE_DEFAULT
    });
  }

  /* api: variant */

  _variant = VARIANT_VALUES[VARIANT_DEFAULT];
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT,
      returnObjectValue: true
    });
  }

  /* getters */

  get computedShowCounter() {
    return this._counterType !== COUNTERTYPE_NONE;
  }

  get computedCounterMessage() {
    const length = this.computedLength;
    const values = {
      length,
      tooFew: this.minLength - length,
      tooMany: length - this.maxLength,
      unit: this._counterType
    };

    if (this.minLength && values.tooFew > 0) {
      values.unit += pluralize(values.tooFew);
      return formatTemplate(this._counterTooFewTemplate, values);
    } else if (this.maxLength && values.tooMany > 0) {
      values.unit += pluralize(values.tooMany);
      return formatTemplate(this._counterTooManyTemplate, values);
    }

    values.unit += pluralize(length);
    return formatTemplate(this._counterRegularTemplate, values);
  }

  get computedClassName() {
    return {
      "rpl-form__textarea": true,
      [this._variant]: this._variant,
      "rpl-form__textarea--disabled": this.disabled,
      "rpl-form__textarea--invalid": this.sfGpsDsIsError
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLength() {
    const value = this.value;
    let length = value?.length || 0;

    if (value && this._counterType === COUNTERTYPE_WORD) {
      length = value.trim().split(/\s+/).length;
    }

    return length;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  /* overrides */

  get warningFlag() {
    return super.warningFlag && !this.computedShowCounter;
  }

  _height = ROWS_DEFAULT;
  _heightOriginal = ROWS_DEFAULT;

  get height() {
    return this._heightOriginal;
  }

  set height(value) {
    this._heightOriginal = value;
    this._height = normaliseInteger(value, {
      fallbackValue: ROWS_DEFAULT,
      minValue: ROWS_MIN,
      maxValue: ROWS_MAX
    });
  }

  reportValidity() {
    const valid = super.reportValidity();
    this.setAttribute("data-invalid", !valid);
    return valid;
  }

  checkValidity() {
    return super.checkValidity() && this.computedLength <= this.maxLength;
  }

  setValidity() {
    this._validity = this.refs.textarea.validity;

    switch (true) {
      case this.value && this.minLength && this.minLength > this.computedLength:
        this.setCustomValidity(this.messageWhenTooShort);
        break;
      case this.value && this.maxLength && this.maxLength < this.computedLength:
        this.setCustomValidity(this.messageWhenTooLong);
        break;
      case ((this.value &&
        (this.computedLength >= this.minLength ||
          Number.isNaN(this.minLength)) &&
        (this.computedLength <= this.maxLength ||
          Number.isNaN(this.maxLength))) ||
        !this.value) &&
        (this.errorMessage === this.messageWhenTooShort ||
          this.errorMessage === this.messageWhenTooLong):
        this.setCustomValidity("");
        break;
      default:
        if (!this._validity.customError) {
          this.setCustomValidity("");
        }
    }

    this.isError = !this._validity.valid;
    if (this._validity.valueMissing) {
      this.errorMessage = this.messageWhenValueMissing;
    } else if (this._validity.tooShort) {
      this.errorMessage = this.messageWhenTooShort;
    } else if (this._validity.badInput) {
      this.errorMessage = this.messageWhenBadInput;
    } else if (this._validity.customError);
    else {
      this.isError = false;
      this.errorMessage = "";
    }
  }

  handleMaxLength() {
    /* if there is a counter we do not need further feedback */
    if (!this.computedShowCounter) {
      super.handleMaxLength();
    }
  }
}
