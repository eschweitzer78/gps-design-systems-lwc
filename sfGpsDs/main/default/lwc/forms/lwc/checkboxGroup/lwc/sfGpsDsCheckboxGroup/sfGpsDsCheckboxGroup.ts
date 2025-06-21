import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  api, 
  track 
} from "lwc";
import { 
  uniqueId, 
  isString, 
  isArray 
} from "c/sfGpsDsHelpers";
import pubsub from "c/sfGpsDsPubSub";

import type { Option, InternalOption } from "c/sfGpsDsCheckboxGroup";

/* This is the base for a headless CheckboxGroup */

const I18N = {
  cmpFieldRequired: "Value is required.",
  messageWhenValueMissing: "This field is required."
};

export const ELEMENT_SELECTOR = "[data-sfgpsds-input]";
export const DISABLED_TRUE_VALUES = [true, "true", "disabled"];
export const READONLY_TRUE_VALUES = [true, "true", "read-only"];
export const REQUIRED_TRUE_VALUES = [true, "true", "required"];
export const VALUE_SEPARATOR = ";";

const CHECKED_DEFAULT = false;
const DISABLED_DEFAULT = false;
const READONLY_DEFAULT = false;
const REQUIRED_DEFAULT = false;
const OPTIONS_DEFAULT: Option[] = []
const FIRECHANGEONSET_DEFAULT = true;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsCheckboxGroup";

export default 
class SfGpsDsCheckboxGroup 
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  name?: string;

  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  fieldLevelHelp?: string;

  // @ts-ignore
  @api 
  fieldLevelHelpPosition?: string;

  // @ts-ignore
  @api 
  alignment: "horizontal" | "vertical" = "vertical";

  _elementId = uniqueId("sf-gps-ds-checkbox-group");

  /* api: disabled */

  _disabled: boolean = DISABLED_DEFAULT;
  _disabledOriginal: boolean | string = DISABLED_DEFAULT;

  // @ts-ignore
  @api 
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value: boolean | string) {
    if (DEBUG) {
      console.log(
        CLASS_NAME, "> set disabled", 
        JSON.stringify(value)
      );
    }

    this._disabledOriginal = value;
    this._disabled = DISABLED_TRUE_VALUES.includes(value);

    if (DEBUG) {
      console.log(
        CLASS_NAME, "< set disabled", 
        JSON.stringify(this._disabled)
      );
    }
  }

  /* api: readOnly */

  _readOnly = READONLY_DEFAULT;
  _readOnlyOriginal: boolean | string = READONLY_DEFAULT;

  // @ts-ignore
  @api 
  get readOnly(): boolean | string {
    return this._readOnlyOriginal;
  }

  set readOnly(value: boolean | string) {
    if (DEBUG) {
      console.log(
        CLASS_NAME, "> set readOnly", 
        JSON.stringify(value)
      );
    }

    this._readOnlyOriginal = value;
    this._readOnly = READONLY_TRUE_VALUES.includes(value);

    if (DEBUG) {
      console.log(
        CLASS_NAME, "< set readOnly", 
        JSON.stringify(this._readOnly)
      );
    }
  }

  /* api: required */

  _required = REQUIRED_DEFAULT;
  _requiredOriginal: boolean | string = REQUIRED_DEFAULT;

  // @ts-ignore
  @api 
  get required(): boolean | string {
    return this._requiredOriginal;
  }

  set required(value: boolean | string) {
    if (DEBUG) {
      console.log(
        CLASS_NAME, "> set required", 
        JSON.stringify(value)
      );
    }

    this._requiredOriginal = value;
    this._required = REQUIRED_TRUE_VALUES.includes(value);

    if (DEBUG) {
      console.log(
        CLASS_NAME, "< set required", 
        JSON.stringify(this._required)
      );
    }
  }

  /* api: value */

  // @ts-ignore
  @track 
  _value: string[] = [];

  // @ts-ignore
  @api 
  get value() {
    if (DEBUG) {
      console.log(
        CLASS_NAME, "> get value", 
        JSON.stringify(this._value)
      );
    }

    const rv = this._value ? this._value.join(VALUE_SEPARATOR) : "";

    if (DEBUG) {
      console.log(
        CLASS_NAME, "< get value", 
        JSON.stringify(rv)
      );
    }

    return rv;
  }

  set value(value: string[] | string) {
    if (DEBUG) {
      console.log(
        CLASS_NAME, "> set value", 
        JSON.stringify(value)
      );
    }

    if (isArray(value)) {
      this._value = value as string[];
    } else {
      if (!isString(value)) {
        value = value != null ? value.toString() : "";
      }

      let split = (value as string).split(VALUE_SEPARATOR);

      if (split.length === 1 && split[0] === "") {
        split = [];
      }

      this._value = split;
    }

    if (DEBUG) {
      console.log(
        CLASS_NAME, "= set value ", 
        JSON.stringify(this._value)
      );
    }

    this._updateInternalOptions();
    this._notifyChange(true);

    if (DEBUG) {
      console.log(
        CLASS_NAME, "< set value", 
        JSON.stringify(this._value)
      );
    }
  }

  /* api: options */

  _options: Option[] = OPTIONS_DEFAULT;
  _optionsOriginal: Option[] | string[] | string = OPTIONS_DEFAULT;

  // @ts-ignore
  @api 
  get options(): Option[] | string[] | string {
    return this._optionsOriginal;
  }

  set options(options: Option[] | string[] | string) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> set options", 
        JSON.stringify(options)
      );
    }

    this._optionsOriginal = options;

    if (Array.isArray(options)) {
      this._options = options.map((option: Option | string) => {
        switch (typeof option) {
          case "string":
            return {
              label: option as string,
              value: option as string
            };
            
          case "object": 
            return {
              label: (option as Option).label,
              value: (option as Option).value
            }
            
          default: 
            return {
              label: (option as any).toString(),
              value: (option as any).toString()
            }
        }
      });
    } else {
      if (!isString(options)) {
        options = options?.toString() || "";
      }

      let split = (options as string).split(VALUE_SEPARATOR);

      if (split.length === 1 && split[0] === "") {
        split = [];
      }

      this._options = split.map((option) => ({
        label: option,
        value: option
      }));
    }

    this._updateInternalOptions();

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "< set options", 
        JSON.stringify(this._options)
      );
    }
  }

  // @ts-ignore
  @api
  checked?: boolean | string;
  _checked = this.defineBooleanProperty("checked", {
    defaultValue: CHECKED_DEFAULT
  });

  /* api: requiredLabel */

  _requiredLabel = I18N.cmpFieldRequired;

  // @ts-ignore
  @api
  get requiredLabel(): string {
    return this._requiredLabel;
  }

  set requiredLabel(value: string) {
    this._requiredLabel = value || I18N.cmpFieldRequired;
  }

  /* api: fireChangeOnSetValue */

  // @ts-ignore
  @api
  fireChangeOnSetValue?: boolean | string;
  _fireChangeOnSetValue = this.defineBooleanProperty("fireChangeOnSetValue", {
    defaultValue: FIRECHANGEONSET_DEFAULT
  });

  /* track: _internalOptions */

  // @ts-ignore
  @track 
  _internalOptions?: InternalOption[];

  _updateInternalOptions() {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> _updateInternalOptions");
    }

    let value: string[] = [];

    this._internalOptions = this._options.map((option, index) => {
      const optionValue = option.value ? option.value.toString() : null;
      const selected =
        this._value && optionValue ? this._value.includes(optionValue) : false;

      if (selected) {
        value.push(option.value);
      }

      return this._mapInternalOption(option, index, selected);
    });

    this._value = value;

    if (DEBUG)
      console.log(
        CLASS_NAME, "< _updateInternalOptions",
        JSON.stringify(this._internalOptions)
      );
  }

  _mapInternalOption(
    option: Option, 
    index: number, 
    selected: boolean
  ): InternalOption {
    return {
      ...option,
      id: `sfgpsds-checkbox-${index + 1}`,
      name: `${this._elementId}-${index + 1}`,
      selected: selected
    } 
  }

  /* methods */

  // @ts-ignore
  @api 
  focus() {
    const element = this.template?.querySelector(ELEMENT_SELECTOR) as HTMLElement;
    element?.focus();
  }

  /* event management */

  _isChanged = false;

  handleChange(event: InputEvent): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleChange", JSON.stringify(this._value));

    this._isChanged = true;

    const element = event.target as HTMLInputElement;
    const index = parseInt(element.dataset.index || "", 10);

    if (!isNaN(index)) {
      const safeInternalOptions = (this._internalOptions as InternalOption[]);
      this.checked = element.checked;
      safeInternalOptions[index].selected = element.checked;

      this._value = safeInternalOptions
        .filter((option) => option.selected)
        .map((option) => option.value);
    }

    if (DEBUG)
      console.log(
        "= handleChange",
        JSON.stringify(this._value),
        JSON.stringify(this._internalOptions)
      );

    this._updateInternalOptions();
    this._assessValidity();
    this._notifyChange();

    if (DEBUG) console.debug(CLASS_NAME, "< handleChange", JSON.stringify(this._value));
  }

  handleFocus(event: FocusEvent): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleFocus");

    const element = event.target as HTMLInputElement;
    this.checked = element.checked;

    this.dispatchEvent(
      new CustomEvent("focus", {
        composed: true,
        bubbles: true,
        detail: element.value
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< handleFocus");
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleKeyDown", event.key);

    switch (event.key) {
      case "Tab":
        this.reportValidity();
        break;

      default:
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleKeyDown");
  }

  _notifyChange(isSet = false): void {
    if (this.name) {
      pubsub.fire(this.name, "valuechange", {
        name: this.name,
        value: this.value
      });
    }

    if (this._fireChangeOnSetValue || !isSet) {
      this.dispatchEvent(
        new CustomEvent("change", {
          composed: true,
          bubbles: true
        })
      );
    }
  }

  /* lifecycle */
  /* --------- */

  connectedCallback() {
    this.tabIndex = 0;
  }

  /* validation */
  /* ---------- */

  // @ts-ignore
  @api 
  messageWhenValueMissing = I18N.messageWhenValueMissing;

  // @ts-ignore
  @track 
  _errorMessage?: string;

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

  // @ts-ignore
  @api 
  get validity(): ValidityState {
    return Object.freeze({...this._validity});
  }

  get _hasError(): boolean {
    return this._errorMessage !== "";
  }

  // @ts-ignore
  _assessValidity(
    showError: boolean = false
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> _assessValidity", showError);

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

    if (DEBUG) console.debug(CLASS_NAME, "< _assessValidity");
  }

  // @ts-ignore
  @api 
  checkValidity(): boolean {
    if (DEBUG) console.debug(CLASS_NAME, "> checkValidity");

    this._assessValidity();
    const cv = !!this._validity?.valid;

    if (DEBUG) console.debug(CLASS_NAME, "< checkValidity", cv);
    return cv;
  }

  // @ts-ignore
  @api 
  reportValidity(): boolean {
    if (DEBUG) console.debug(CLASS_NAME, "> reportValidity");

    this._assessValidity(true);
    const rv = !!this._validity?.valid;

    if (DEBUG) console.debug(CLASS_NAME, "< checkValidity", rv);
    return rv;
  }

  // @ts-ignore
  @api 
  setCustomValidity(message: string): void {
    this._errorMessage = message;
    this._validity.customError = this._hasError;
  }
}
