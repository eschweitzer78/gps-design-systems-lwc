import { api, track } from "lwc";
import { debounce } from "c/sfGpsDsOsrtAsyncUtils";
import { dispatchOmniEvent } from "c/sfGpsDsOsrtOmniscriptUtils";
import { VALIDATION_EVENTS } from "./sfGpsDsOsrtOmniscriptValidation";

/**
 * Mixin adding functionality for input-level omniscript validation.
 * @param {LightningElement} Base
 */
export const HasValidation = (Base) => {
  return class extends Base {
    _isValid;
    _showValidation;
    _inputSelector = "[data-omni-input]";
    _readOnly = false;
    _readOnlyClass;
    _handleKeyup = debounce(this.handleKeyup.bind(this), 500);
    _handleKeydown = this.handleKeydown.bind(this);
    _preventUpdate = this.preventUpdate.bind(this);
    _forceJsonToApply = false;

    _autocomplete;
    _messageWhenValueMissing;
    _messageWhenTooShort;
    _messageWhenTooLong;
    _messageWhenBadInput;
    _messageWhenPatternMismatch;
    _messageWhenRangeOverflow;
    _messageWhenRangeUnderflow;
    _messageWhenStepMismatch;
    _messageWhenTypeMismatch;
    _messageWhenMaskIncomplete;
    _needMoreValidation = true;
    _setValueStrict = true;
    _name = null;
    @track tabIndex;

    get isValid() {
      return this._isValid;
    }

    set isValid(value) {
      const conditionType = !this._propSetMap.conditionType
        ? "Hide if False"
        : this._propSetMap.conditionType;

      const omniShow =
        conditionType === "Hide if False"
          ? !this._propSetMap.show || this._omniShow
          : true;
      if (omniShow) {
        if (this._isValid !== value) {
          if (value && this._isValid === false) {
            dispatchOmniEvent(
              this,
              { jsonPath: this.jsonDef.lwcId },
              VALIDATION_EVENTS.VALID
            );
          } else if (value === false) {
            dispatchOmniEvent(
              this,
              { jsonPath: this.jsonDef.lwcId },
              VALIDATION_EVENTS.INVALID
            );
          }
        } else if (
          conditionType === "Hide if False" &&
          this._propSetMap.show &&
          !this._omniSavedShow &&
          !value
        ) {
          dispatchOmniEvent(
            this,
            { jsonPath: this.jsonDef.lwcId },
            VALIDATION_EVENTS.INVALID
          );
        }
      }
      if (conditionType === "Hide if False" && this._propSetMap.show) {
        this._omniSavedShow = this._omniShow;
      }

      this._isValid = value;
    }

    @api get label() {
      return this._propSetMap.label;
    }

    @api get validationMessage() {
      return this.childInput ? this.childInput.validationMessage : undefined;
    }

    @api get validity() {
      try {
        return this.childInput && this.childInput.validity
          ? this.childInput.validity
          : {};
      } catch (err) {
        return {};
      }
    }

    /**
     * Override for applyCallResp, adds check for UI validity.
     * @param {*} json
     * @param {boolean} [bApi=false] - Denotes the method caller is an API response. False indicates user initiated.
     * @param {boolean} [bValidation=false] - Denotes a server side validation response.
     */
    @api applyCallResp(json, bApi = false, bValidation = false) {
      if (json !== undefined) {
        if (!bValidation) {
          // validateData should only run for bApi = true
          const result = bApi
            ? this.validateData(json)
            : { valid: true, dataToApply: json };
          let jsonToApply = bApi ? result.dataToApply : json;
          let preVal;

          if (bApi) {
            if (
              !result.valid ||
              (this.isEqual(jsonToApply, this.elementValue) &&
                this.reportValidity())
            ) {
              return;
            }

            if (this.childInput) {
              preVal = this.childInput.value;
              this.setChildInputValue(jsonToApply);
              // Radio/Select/Multi-select has weird this.childInput.value behavior,
              // therefore bypass the second validation
              if (this._needMoreValidation) {
                if (this._setValueStrict !== false) {
                  // allow the input to handle data parsing before applying to the json
                  // only if postVal === jsonToApply, it means that it's valid (if there is mask)
                  const postVal = this.childInput.value;
                  if (!this.isEqual(postVal, jsonToApply)) {
                    // invalid value, restore
                    jsonToApply = preVal;
                    this.setChildInputValue(preVal);
                  }
                } else {
                  const postVal = this.childInput.value;
                  const isDebounce = this.isEqual(preVal, postVal);
                  const wrapper = isDebounce
                    ? (x) => Promise.resolve().then(x)
                    : (x) => x();
                  wrapper(
                    this.handleValueSetApi.bind(
                      this,
                      jsonToApply,
                      bApi,
                      bValidation,
                      preVal,
                      isDebounce ? undefined : postVal
                    )
                  );
                  // handleValueSetApi deals with the super apply call resp for us, so we escape here
                  return;
                }
              }
            }
            // In order for the child input to run it's validation,
            // we have to allow the cpu to process a cycle.
            Promise.resolve().then(() => {
              if (
                this.reportValidity() ||
                this._forceJsonToApply ||
                preVal !== jsonToApply
              ) {
                super.applyCallResp(jsonToApply, bApi, bValidation);
              } else if (
                this.jsonDef.type === "Select" &&
                this._dependency &&
                this._propSetMap.required
              ) {
                // special case for required dependent select
                super.applyCallResp(jsonToApply, bApi, bValidation);
              }
            });
          } else if (
            this._initialRender ||
            this.reportValidity() === true ||
            this._forceJsonToApply
          ) {
            super.applyCallResp(jsonToApply, bApi, bValidation);
          }
        } else {
          super.applyCallResp(json, bApi, bValidation);
        }
      }
    }

    handleValueSetApi(jsonToApply, bApi, bValidation, preVal, postValA) {
      const postVal = postValA !== undefined ? postValA : this.childInput.value;
      // allow the input to handle data validation, filtering and parsing before applying to the json
      // this is only set due to complicated in component data handling that cannot be easily extracted
      jsonToApply = postVal;
      if (
        !this.isEqual(jsonToApply, preVal) ||
        jsonToApply == null ||
        jsonToApply === ""
      ) {
        if (this.reportValidity() || this._forceJsonToApply) {
          super.applyCallResp(jsonToApply, bApi, bValidation);
        }
      }
    }

    setChildInputValue(value) {
      if (typeof this.childInput.setValue === "function") {
        this.childInput.setValue(value);
      } else {
        this.childInput.value = value;
      }
    }

    /**
     * Interface for native DOM checkValidity().
     * Performs custom validation as well as native Constraint Validation API calls.
     * Returns a boolean, but doesn't trigger display of validation messages.
     * @returns {boolean}
     */
    @api checkValidity() {
      if (this.childInput && typeof this.doCustomValidation === "function") {
        this.doCustomValidation();
      }

      this.isValid = this.childInput ? this.childInput.checkValidity?.() : true;
      return this.isValid;
    }

    /**
     * Interface for native DOM reportValidity().
     * Performs custom validation as well as native Constraint Validation API calls.
     * Returns a boolean, and triggers the display of validation messages.
     * @returns {boolean}
     */
    @api reportValidity() {
      if (this.childInput && typeof this.doCustomValidation === "function") {
        this.doCustomValidation();
      }

      // Setting this.isValid will add listeners to hide validation messages as soon as the input is valid.
      this.isValid = this.childInput ? this.childInput.reportValidity() : true;
      this._showValidation = !this.isValid;

      return this.isValid;
    }

    @api focus() {
      if (this.childInput && !this._readOnly) {
        this.childInput.focus();
      }
    }

    setReadOnly(value) {
      if (this.childInput && value === true) {
        this.classList.add(this._readOnlyClass);
        this.setAttribute("aria-readonly", true);

        // setting the input name to 'search' prevents Safari from autofilling a readonly field
        this._name = "search";
        // setting autocomplete to 'new-password' prevents Chrome from autofilling a readonly field
        this._autocomplete = "new-password";
      } else if (this.childInput && !value) {
        this.classList.remove(this._readOnlyClass);
        this.removeAttribute("aria-readonly");
        this._name = null;
        this._autocomplete = this._propSetMap.autocomplete;
      }

      return (this._readOnly = value);
    }

    /**
     * Universal keyup listener.
     * @param {KeyboardEvent} evt
     * @returns
     */
    handleKeyup(evt) {
      // When an input becomes invalid, the user should get immediate feedback
      // that they've corrected their mistake.
      if (this._commitOnChange) {
        if (this.reportValidity()) {
          this.applyCallResp(evt.value);
        }
      } else if (this._showValidation === true) {
        this.reportValidity();
      }
    }

    /**
     * Universal handler for key down.
     * @param {KeyboardEvent} evt
     */
    handleKeydown(evt) {
      if (this._readOnly) {
        switch (true) {
          case evt.key === "Spacebar":
          case evt.key === "Backspace":
          case evt.key === "Delete":
          case evt.key === "Enter":
          case !evt.ctrlKey && evt.key.length === 1:
            evt.preventDefault();
            break;
          default:
            // continue
            break;
        }
      }
    }

    /**
     * Prevents editing of input when input is read-only.
     * @param {Event} evt
     */
    preventUpdate(evt) {
      if (this._readOnly) {
        evt.preventDefault();
      }
    }

    connectedCallback() {
      this.template.addEventListener("keyup", this._handleKeyup);
      this.template.addEventListener("keydown", this._handleKeydown);
      this.template.addEventListener("paste", this._preventUpdate);
      this.template.addEventListener("cut", this._preventUpdate);
      this.template.addEventListener("drop", this._preventUpdate);
      this.template.addEventListener("click", this._preventUpdate);
      this._readOnlyClass =
        this.layout === "newport" ? "nds-read-only" : "omni-read-only";

      if (typeof super.connectedCallback === "function") {
        super.connectedCallback();
      }
    }

    disconnectedCallback() {
      this.template.removeEventListener("keyup", this._handleKeyup);
      this.template.removeEventListener("keydown", this._handleKeydown);
      this.template.removeEventListener("paste", this._preventUpdate);
      this.template.removeEventListener("cut", this._preventUpdate);
      this.template.removeEventListener("drop", this._preventUpdate);
      this.template.removeEventListener("click", this._preventUpdate);
    }

    initCompVariables() {
      super.initCompVariables();

      this._messageWhenValueMissing = this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniRequired,
        this.allCustomLabelsUtil.OmniRequiredWithLabel
      );
      this._messageWhenTooShort = `${this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniMinLength,
        this.allCustomLabelsUtil.OmniMinLengthWithLabel
      )} ${this._propSetMap.minLength}.`;
      this._messageWhenTooLong = `${this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniMaxLength,
        this.allCustomLabelsUtil.OmniMaxLengthWithLabel
      )} ${this._propSetMap.maxLength}.`;
      this._messageWhenBadInput = this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniValidationBadInput,
        this.allCustomLabelsUtil.OmniValidationBadInputWithLabel
      );
      this._messageWhenPatternMismatch = this._propSetMap.ptrnErrText
        ? this._propSetMap.ptrnErrText
        : this.generateErrorMessage(
            this.allCustomLabelsUtil.OmniValidationPatternMismatch,
            this.allCustomLabelsUtil.OmniValidationPatternMismatchWithLabel
          );
      this._messageWhenRangeOverflow = this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniValidationRangeOverflow,
        this.allCustomLabelsUtil.OmniValidationRangeOverflowWithLabel
      );
      this._messageWhenRangeUnderflow = this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniValidationRangeUnderflow,
        this.allCustomLabelsUtil.OmniValidationRangeUnderflowWithLabel
      );
      this._messageWhenStepMismatch = this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniValidationStepMismatch,
        this.allCustomLabelsUtil.OmniValidationStepMismatchWithLabel
      );
      this._messageWhenTypeMismatch = this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniValidationTypeMismatch,
        this.allCustomLabelsUtil.OmniValidationTypeMismatchWithLabel
      );
      this._messageWhenMaskIncomplete = this.generateErrorMessage(
        this.allCustomLabelsUtil.OmniValidationMaskIncomplete,
        this.allCustomLabelsUtil.OmniValidationMaskIncompleteWithLabel
      );
    }

    generateErrorMessage(errorMessage, errorMessageWithLabel) {
      let errMsg;
      if (this.label) {
        errMsg = errorMessageWithLabel?.replace(/\{0\}/gi, this.label);
      } else {
        errMsg = errorMessage;
      }
      return `${this.allCustomLabelsUtil.OmniErrorPrefix} ${errMsg}`;
    }

    /**
     * @scope private
     * @description Set Custom Validation on input (Used for set error action).
     *              - reportValidity on step for components.
     * @param {*} json
     * @returns {Void}
     */
    setCustomValidation(json) {
      if (this.childInput) {
        this.childInput.setCustomValidity(json);
        this.childInput.customValidationMessage = json;
        this.reportValidity();
        if (!this.isFocusEventAttached) {
          this.template.addEventListener(
            "focusout",
            this.onFocusOutErrorElement
          );
          this.isFocusEventAttached = true;
        }
      }
    }

    onFocusOutErrorElement = (event) => {
      this.childInput.setCustomValidity("");
      this.reportValidity();
      this.applyCallResp(event.target.value);
      this.template.removeEventListener(
        "focusout",
        this.onFocusOutErrorElement
      );
      this.isFocusEventAttached = false;
    };

    renderedCallback() {
      if (this._initialRender) {
        // Set the child input, and let the validationAggregator know the validation state.
        this.childInput =
          this.template.querySelector(this._inputSelector) ||
          this.querySelector(this._inputSelector);
        // For Elements that have no show/hide set up
        // therefore checkValidity() needs to be called here
        // but for the Elements that have show/hide set up, validity will be checked
        // as part of omniShow()
        if (
          !this._propSetMap?.show ||
          ["Readonly if False", "Optional if False"].includes(
            this._propSetMap.conditionType
          )
        ) {
          this.checkValidity();
        }
      }
      if (
        this._propSetMap.readOnly !== undefined &&
        this._propSetMap.readOnly !== this._readOnly
      ) {
        this.setReadOnly(this._propSetMap.readOnly);
      }
      if (typeof super.renderedCallback === "function") {
        super.renderedCallback();
      }
    }

    isEqual(a, b) {
      let bEqual = this.lodashUtil.isEqual(a, b);
      if (!bEqual && ((a === null && b === "") || (b === null && a === ""))) {
        bEqual = true;
      }
      return bEqual;
    }
  };
};
