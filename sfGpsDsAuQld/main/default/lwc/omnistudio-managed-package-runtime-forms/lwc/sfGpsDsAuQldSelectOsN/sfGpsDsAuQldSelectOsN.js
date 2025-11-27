/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { isArray } from "c/sfGpsDsHelpersOs";
import OmniscriptPubSub from "omnistudio/pubsub";
import OmniscriptSalesforceUtils from "omnistudio/salesforceUtils";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixinOsN";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldSelectOsN";

const NONE = "none";
const INPUT_SELECTOR = "[data-sfgpsds-input]";

export default class extends StatusHelperMixin(LightningElement) {
  @api label;
  @api name;
  @api required;
  @api disabled;
  @api tabIndex;
  @api readOnly;
  @api messageWhenValueMissing;

  @api multiple;
  @api maxCount;
  @api sortField;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition; // disregarded

  @track isError = false;
  @track errorMessage;

  /* api: value */

  _value;

  @api
  get value() {
    let rv = this._displayOptions
      .filter((item) => item.selected)
      .map((item) => (item.value === NONE ? "" : item.value));

    return rv.length === 1 ? rv[0] : rv;
  }

  set value(value) {
    const t = (val) => {
      try {
        switch (typeof val) {
          case "string":
            if (val.indexOf("]") !== -1) {
              let parsedValue = JSON.parse(val);
              if (isArray(parsedValue)) {
                parsedValue.map((item) => {
                  return typeof item === "string" ? item : String(item);
                });
              } else {
                return parsedValue;
              }
            }

            return this.multiple ? value.split(",") : [val];

          case "number":
          case "boolean":
            return [String(val)];

          default:
            return null;
        }
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        return null;
      }
    };

    if (value != null) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        this._value = t(value);
      } else {
        if (isArray(value)) {
          this._value = value.map((e) => {
            return typeof e === "string" ? e : String(e);
          });
        } else {
          this._value = [...value];
        }
      }
    } else {
      this._value = null;
    }

    this.updateDisplayOptions();
  }

  /* api: options */

  _options;
  @track _displayOptions;

  @api
  get options() {
    return this._options.map((item) => {
      if (item.value === NONE) {
        item.value = "";
      }

      return item;
    });
  }

  set options(options) {
    const safeParse = (val) => {
      try {
        return JSON.parse(val);
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        return [];
      }
    };

    this._options =
      options && options.length
        ? typeof options === "string"
          ? safeParse(options)
          : options
        : [];
    this._options = this._options.map((item, index) => ({
      ...item,
      value:
        item.value === ""
          ? NONE
          : typeof item.value === "boolean"
            ? String(item.value)
            : item.value,
      index: index
    }));

    this.sortOptions();
    this.updateDisplayOptions();
  }

  /* api: sorted */

  @track _sorted;

  @api
  get sorted() {
    return this._sorted;
  }

  set sorted(value) {
    this._sorted = value === true || value === "true";
    this.sortOptions();
  }

  /* api: requiredLabel */

  _requiredLabel;

  @api
  get requiredLabel() {
    return this._requiredLabel;
  }

  set requiredLabel(value) {
    this._requiredLabel =
      value || OmniscriptSalesforceUtils.inputLabels.cmpRequired;
  }

  /* computed */

  get computedSelectClassName() {
    return {
      qld__select: true,
      "qld__text-input--block": true,
      "qld__text-input--error": this.isError
    };
  }

  get computedDisabled() {
    return this.disabled || this.readOnly;
  }

  get computedAriaDescribedBy() {
    return {
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    };
  }

  /* methods */

  updateDisplayOptions() {
    this._displayOptions = this._options
      ? this._options.map((item) => ({
          ...item,
          selected:
            this._value != null &&
            this._value.some((value) => value === item.value)
        }))
      : null;

    this.reportValidity();
  }

  sortOptions() {
    if (!this.sorted || this._options?.length) {
      return;
    }

    let sortedOptions = this._options
      .sort((a, b) => {
        const valA =
          this.sortField && typeof this.sortField === "string"
            ? a[this.sortField]
            : a.label;
        const valB =
          this.sortField && typeof this.sortField === "string"
            ? b[this.sortField]
            : b.label;

        return valA < valB ? -1 : valA > valB ? 1 : 0;
      })
      .forEach((item, index) => {
        item.index = index;
      });

    this._options = [...sortedOptions];
  }

  /* focus */

  @api focus() {
    this.template.querySelector(INPUT_SELECTOR).focus();
  }

  /* validation */

  _validity = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false
  };

  setValidity(setError) {
    if (!this._validity.customError) {
      this.isError = false;
      this.errorMessage = "";
    }

    let value = this.value;

    if ((!value || value.length === 0) && this.required) {
      this._validity.valueMissing = true;

      if (setError) {
        this.isError = true;
        this.errorMessage = this.messageWhenValueMissing;
      }
    } else {
      this._validity.valueMissing = false;
    }

    this._validity.valid =
      !this._validity.customError && !this._validity.valueMissing;
  }

  @api checkValidity() {
    if (this.sfGpsDsHasCustomValidation()) {
      return false;
    }

    this.setValidity(false);
    return this._validity && this._validity.valid;
  }

  @api reportValidity() {
    this.setValidity(true);

    if (this.sfGpsDsHasCustomValidation()) {
      return false;
    }

    return this._validity.valid;
  }

  @api setCustomValidity(message) {
    this._validity.customError = this.isError = message === "" ? false : true;
    this.errorMessage = message;
  }

  @api showHelpMessageIfInvalid() {
    this.setValidity(true);
  }

  // event management

  handleChange(event) {
    const selectedElements = event.currentTarget.selectedOptions;
    let selectedIndexes = [];
    let selectedValues = [];

    for (let i = 0; i < selectedElements.length; i++) {
      selectedIndexes.push(selectedElements[i].dataset?.index);
    }

    if (this._options) {
      this._options.forEach((elt) => {
        elt.selected = selectedIndexes.includes(elt.index.toString());
        if (elt.selected) {
          selectedValues.push(elt.value);
        }
      });
    }

    this._value = selectedValues;
    this.updateDisplayOptions();

    OmniscriptPubSub.fire(this.name, "valuechange", {
      name: this.name,
      value: selectedValues.join(",")
    });

    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleBlur() {
    this.reportValidity();
    this.dispatchEvent(
      new CustomEvent("blur", { bubbles: true, composed: true })
    );
  }

  handleFocus() {
    this.dispatchEvent(
      new CustomEvent("focus", { bubbles: true, composed: true })
    );
  }

  /* partial OmniInputMixin */

  @api setCustomValidation(message) {
    if (DEBUG) console.debug(CLASS_NAME, "> setCustomValidation", message);
    this._sfGpsDsCustomValidation = message;
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< setCustomValidation",
        "_sfGpsDsCustomValidation: " + this._sfGpsDsCustomValidation
      );
  }

  _sfGpsDsCustomValidation = "";

  @api sfGpsDsHasCustomValidation() {
    const rv = !!this._sfGpsDsCustomValidation;
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsHasCustomValidation", rv);
    return rv;
  }

  @api sfGpsDsClearCustomValidation() {
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsClearCustomValidation");
    this._sfGpsDsCustomValidation = "";
  }

  @api sfGpsDsGetCustomValidation() {
    const rv = this._sfGpsDsCustomValidation;
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsGetCustomValidation", rv);
    return rv;
  }

  @api
  get validity() {
    const hcv = this.sfGpsDsHasCustomValidation();
    const srv = this._validity;
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

    if (DEBUG) console.debug(CLASS_NAME, "get validity", rv);
    return rv;
  }

  @api
  get validationMessage() {
    const svm = super.validationMessage;
    const rv = this.sfGpsDsGetCustomValidation() || svm;

    if (DEBUG) console.debug(CLASS_NAME, "get validationMessage", rv);

    return rv;
  }

  get sfGpsDsIsError() {
    const rv = this.isError || this.sfGpsDsHasCustomValidation();
    if (DEBUG) console.debug(CLASS_NAME, "get sfGpsDsIsError", rv);
    return rv;
  }

  get sfGpsDsErrorMessage() {
    return this.sfGpsDsGetCustomValidation() || this.errorMessage;
  }
}
