/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsAuthRegister from "c/sfGpsDsAuthRegister";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2RegisterComm";

/**
 * @slot terms
 */
export default class extends SfGpsDsAuthRegister {
  @api title;
  @api iconName;
  @api iconPosition;
  @api className;

  /* api: includePasswordField */

  @api
  get includePasswordField() {
    return super.includePasswordField;
  }

  set includePasswordField(value) {
    super.includePasswordField = value;
  }

  /* api: extraFieldsFieldset */

  @api
  get extraFieldsFieldset() {
    return super.extraFieldsFieldset;
  }

  set extraFieldsFieldset(value) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> set extraFieldsFieldset", value);
    }

    super.extraFieldsFieldset = value;

    if (DEBUG) {
      console.debug(CLASS_NAME, "< set extraFieldsFieldset");
    }
  }

  /* api: terms */

  _termsHtml;
  _termsOriginal;

  @api
  get terms() {
    return this._termsOriginal;
  }

  set terms(markdown) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> set terms", markdown);
    }

    this._termsOriginal = markdown;
    try {
      this._termsHtml = markdown ? mdEngine.renderEscaped(markdown) : null;
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Terms markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set terms", e);
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< set terms", this._termsHtml);
    }
  }

  /* getters */

  get computedAuthConfigErrorMessage() {
    const i18n = this.i18n;
    return i18n.authConfigErrorTitle + ": " + i18n.authConfigErrorLabel;
  }

  get computedRegistrationDisabledMessage() {
    const i18n = this.i18n;
    return (
      i18n.registrationDisabledTitle + ": " + i18n.registrationDisabledLabel
    );
  }

  get computedErrorMessage() {
    return this.i18n.errorTitle + ": " + this.errorMessage;
  }

  get i18n() {
    const parentI18N = super.i18n;
    const rv = {
      ...parentI18N,
      errorAriaLabel: "Error: ",
      required: "required"
    };

    return rv;
  }

  get computedClassName() {
    return {
      [this.className]: this.className
    };
  }

  /* lifecycle */

  renderedCallback() {
    super.renderedCallback?.();

    const terms = this.refs.terms;

    if (terms && this._termsHtml) {
      replaceInnerHtml(terms, this._termsHtml);
    }
  }
}
