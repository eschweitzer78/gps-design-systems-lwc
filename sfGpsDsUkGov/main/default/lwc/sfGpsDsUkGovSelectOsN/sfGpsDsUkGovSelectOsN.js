import { LightningElement, api, track } from "lwc";
import { computeClass, isArray, isString } from "c/sfGpsDsHelpersOs";
import OmniscriptPubSub from "omnistudio/pubsub";
import OmniscriptSalesforceUtils from "omnistudio/salesforceUtils";

const I18N = {};
const NONE = "none";
const INPUT_SELECTOR = "[data-sfgpsds-input]";

export default class extends LightningElement {
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
                  return isString(item) ? item : String(item);
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
          this._value = value.map((item) => {
            return isString(item) ? item : String(item);
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
        ? isString(options)
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

  /* i18n */

  get i18n() {
    return I18N;
  }

  /* computed */

  get computedFormGroupClassName() {
    return {
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    };
  }

  get computedSelectClassName() {
    return {
      "govuk-select": true,
      "govuk-select--error": this.isError
    };
  }

  get computedDisabled() {
    return this.disabled || this.readOnly;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
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
    this.setValidity(false);
    return this._validity && this._validity.valid;
  }

  @api reportValidity() {
    this.setValidity(true);
    return this._validity.valid;
  }

  @api setCustomValidation(message) {
    this.setCustomValidity(message);
  }

  @api setCustomValidity(message) {
    this._validity.customError = this.isError = message === "" ? false : true;
    this.errorMessage = message;
  }

  @api showHelpMessageIfInvalid() {
    this.setValidity(true);
  }

  @api
  get validationMessage() {
    return this.isError ? this.errorMessage : "";
  }

  // event management

  handleChange(event) {
    /* clear custom validation first */
    if (this._validity.customError) {
      this._validity.customError = false;
      this.setValidity(true);
    }

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
    this.dispatchEvent(
      new CustomEvent("blur", { bubbles: true, composed: true })
    );
  }

  handleFocus() {
    this.dispatchEvent(
      new CustomEvent("focus", { bubbles: true, composed: true })
    );
  }
}
