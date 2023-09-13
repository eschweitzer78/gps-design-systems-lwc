import { LightningElement, api, track } from "lwc";
import { normaliseBoolean, computeClass, uniqueId } from "c/sfGpsDsHelpers";
// import pubsub from "omnistudio/pubsub";

const I18N = {
  cmpFieldRequired: "Value is required.",
  messageWhenValueMissing: "This field is required."
};

const PUB_SUB = null;
const ELEMENT_SELECTOR = "[data-sfgpsds-input]";
const DEBUG = true;

export default class SfGpsDsCheckboxGroup extends LightningElement {
  @api label; // String
  @api tabIndex = "0";
  @api name; // String
  @api fieldLevelHelp; // String
  @api fieldLevelHelpPosition;
  @api alignment; // one of horizontal, vertical

  _elementId = uniqueId("sf-gps-ds-checkbox-group");

  /* api: disabled */

  _disabled;
  _disabledOriginal;

  @api get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    this._disabledOriginal = value;
    this._disabled = value === true || value === "true" || value === "disabled";
  }

  /* api: required */

  _required;
  _requiredOriginal;

  @api get required() {
    return this._requiredOriginal;
  }

  set required(value) {
    this._requiredOriginal = value;
    this._required = value === true || value === "true" || value === "required";
  }

  /* api: value */

  @track _value = []; // Array<String>

  @api get value() {
    if (DEBUG) console.log("> get value", JSON.stringify(this._value));

    let rv = this._value ? this._value.join(";") : "";

    if (DEBUG) console.log("< get value", JSON.stringify(rv));

    return rv;
  }

  set value(value) {
    if (DEBUG) console.log("> set value", JSON.stringify(value));

    if (Array.isArray(value)) {
      this._value = value;
    } else {
      if (typeof value !== "string") {
        value = value != null ? value.toString() : "";
      }

      let split = value.split(";");

      if (split.length === 1 && split[0] === "") {
        split = [];
      }

      this._value = split;
    }

    if (DEBUG) console.log("= set value ", JSON.stringify(this._value));

    this.updateInternalOptions();
    this.notifyChange(true);

    if (DEBUG) console.log("< set value", JSON.stringify(this._value));
  }

  /* api: options */

  _options = [];
  _optionsOriginal;

  @api get options() {
    return this._optionsOriginal;
  }

  set options(options) {
    if (DEBUG) console.log("> set options", JSON.stringify(options));

    this._optionsOriginal = options;

    if (Array.isArray(options)) {
      this._options = options;
    } else {
      if (typeof options !== "string") {
        options = options != null ? options.toString() : "";
      }

      let split = options.split(";");

      if (split.length === 1 && split[0] === "") {
        split = [];
      }

      this._options = split.map((option) => ({
        label: option,
        value: option
      }));
    }

    this.updateInternalOptions();

    if (DEBUG) console.log("< set options", JSON.stringify(this._options));
  }

  /* api: type */

  _type = "checkbox";

  @api get type() {
    return this._type;
  }

  set type(val) {
    this._type = val;
  }

  get isButton() {
    return this.type === "button";
  }

  get isIcon() {
    return this.type === "icon";
  }

  get isCheckbox() {
    return this.type === "checkbox";
  }

  /* api: checked */

  _isChecked;

  @api get checked() {
    return this._isChecked;
  }

  set checked(val) {
    this._isChecked = normaliseBoolean(val, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: requiredLabel */

  _requiredLabel = I18N.cmpRequired;

  @api
  get requiredLabel() {
    return this._requiredLabel;
  }

  set requiredLabel(val) {
    this._requiredLabel = val || I18N.cmpRequired;
  }

  /* api: fireChangeOnSetValue */

  _fireChangeOnSetValue = true;

  @api get fireChangeOnSetValue() {
    return this._fireChangeOnSetValue;
  }

  set fireChangeOnSetValue(value) {
    this._fireChangeOnSetValueOriginal = value;
    this._fireChangeOnSetValue = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* track: _internalOptions */

  @track _internalOptions;

  updateInternalOptions() {
    if (DEBUG) console.log("> updateInternalOptions");

    let value = [];

    this._internalOptions = this._options.map((option, index) => {
      let optionValue = option.value ? option.value.toString() : null;
      let selected =
        this._value && optionValue ? this._value.includes(optionValue) : false;

      if (selected) {
        value.push(option.value);
      }

      return {
        ...option,
        id: `sfgpsds-checkbox-${index + 1}`,
        name: `${this._elementId}-${index + 1}`,
        selected: selected
      };
    });

    this._value = value;

    if (DEBUG)
      console.log(
        "< updateInternalOptions",
        JSON.stringify(this._internalOptions)
      );
  }

  @api focus() {
    let element = this.element;

    if (element) {
      element.focus();
    }
  }

  /* computed */

  get computedFormElementControlClassName() {
    return computeClass({
      "slds-form-element__control": true,
      "sfgpsds-checkbox__horizontal": this.alignment === "horizontal"
    });
  }

  get computedCheckboxButtonLabelClassName() {
    return computeClass({
      "slds-checkbox-button": true,
      "slds-checkbox-button_is-checked": this._isChecked
    });
  }

  /* getters */

  get element() {
    return this.template.querySelector(ELEMENT_SELECTOR);
  }

  get isDisabled() {
    return (
      this.disabled === true ||
      this.disabled === "true" ||
      this.disabled === "disabled"
    );
  }

  /* event management */

  _isChanged;

  handleChange(event) {
    if (DEBUG) console.log("> handleChange", JSON.stringify(this._value));

    this._isChanged = true;

    let element = event.target;
    let index = element.dataset.index;

    this._isChecked = this._internalOptions[index].selected = element.checked;
    this._value = this._internalOptions
      .filter((option) => option.selected)
      .map((option) => option.value);

    if (DEBUG)
      console.log(
        "= handleChange",
        JSON.stringify(this._value),
        JSON.stringify(this._internalOptions)
      );

    this.updateInternalOptions();
    this.setValidity();
    this.notifyChange(false);

    if (DEBUG) console.log("< handleChange", JSON.stringify(this._value));
  }

  handleFocus(event) {
    if (DEBUG) console.log("> handleFocus");

    let element = event.target;
    this._isChecked = element.checked;

    this.dispatchEvent(
      new CustomEvent("focus", {
        composed: true,
        bubbles: true,
        detail: event.target.value
      })
    );

    if (DEBUG) console.log("< handleFocus");
  }

  handleKeyDown(event) {
    if (DEBUG) console.log("> handleKeyDown", event.key);

    switch (event.key) {
      case "Tab":
        this.reportValidity();
        break;

      default:
    }

    if (DEBUG) console.log("< handleKeyDown");
  }

  notifyChange(isSet = false) {
    if (PUB_SUB) {
      PUB_SUB.fire(this.name, "valuechange", {
        name: this.name,
        value: this.value
      });
    }

    if (!this._fireChangeOnSetValue && isSet) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        composed: true,
        bubbles: true
      })
    );
  }

  /* validation */
  /* ---------- */

  @api messageWhenValueMissing = I18N.messageWhenValueMissing;
  @track _errorMessage;

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

  @api get validity() {
    return this._validity;
  }

  get _isError() {
    return this._errorMessage !== "";
  }

  setValidity(showError) {
    if (DEBUG) console.log("> setValidity", showError);

    if (!this.value && this.required) {
      this._validity.valueMissing = true;
    } else {
      this._validity.valueMissing = false;
    }

    this._validity.valid =
      !this._validity.badInput &&
      !this._validity.customError &&
      !this._validity.patternMismatch &&
      !this._validity.rangeOverflow &&
      !this._validity.rangeUnderflow &&
      !this._validity.stepMismatch &&
      !this._validity.tooLong &&
      !this._validity.tooShort &&
      !this._validity.typeMismatch &&
      !this._validity.valueMissing;

    if (showError) {
      switch (true) {
        case this._validity.valid:
          this._errorMessage = "";
          break;

        case !this.value && this.required:
          this._errorMessage = this.messageWhenValueMissing;
          break;

        default:
          this._errorMessage = this._errorMessage || "";
      }
    } else {
      this._errorMessage = "";
    }

    if (DEBUG) console.log("< setValidity");
  }

  @api checkValidity() {
    this.setValidity(false);
    return this._validity && this._validity.valid;
  }

  @api reportValidity() {
    this.setValidity(true);
    return this._validity.valid;
  }

  @api setCustomValidity(message) {
    this._errorMessage = message;
    this._validity.customError = this._isError;
  }

  @api showHelpMessageIfInvalid() {
    this.setValidity(true);
  }
}
