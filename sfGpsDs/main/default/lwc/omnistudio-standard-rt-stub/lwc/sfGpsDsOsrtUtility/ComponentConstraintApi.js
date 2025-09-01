import { componentConstraintApiLabels } from "c/sfGpsDsOsrtSalesforceUtils";

const constraintsSortedByPriority = [
  "customError",
  "badInput",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valueMissing"
];

const defaultLabels = {
  badInput:
    componentConstraintApiLabels.cmpFieldNotValid || "Enter a valid value.",
  customError:
    componentConstraintApiLabels.cmpFieldNotValid || "Enter a valid value.",
  patternMismatch:
    componentConstraintApiLabels.cmpPatternNoMatch ||
    "Your entry does not match the allowed pattern.",
  rangeOverflow:
    componentConstraintApiLabels.cmpRangeOverflowError ||
    "The number is too high.",
  rangeUnderflow:
    componentConstraintApiLabels.cmpRangeUnderflowError ||
    "The number is too low.",
  stepMismatch:
    componentConstraintApiLabels.cmpStepMismatchError ||
    "Your entry isn't a valid increment.",
  tooLong:
    componentConstraintApiLabels.cmpFieldTooLong || "Your entry is too long.",
  tooShort:
    componentConstraintApiLabels.cmpFieldTooShort || "Your entry is too short.",
  typeMismatch:
    componentConstraintApiLabels.cmpTypeMismatchError ||
    "You have entered an invalid format.",
  valueMissing:
    componentConstraintApiLabels.cmpFieldValueMissing || "Complete this field."
};

function getErrorMessage(validity, labelMap) {
  var key;
  if (validity && validity.valid === true) {
    return "";
  }
  constraintsSortedByPriority.forEach((stateName) => {
    if (validity[stateName] === true) {
      key = stateName;
    }
  });
  key = key || "badInput";
  return labelMap[key] ? labelMap[key] : defaultLabels[key];
}

class ValidityState {
  constructor(constraintFns) {
    var key, i;
    this.constraints = constraintFns;
    for (i = 0; i < constraintsSortedByPriority.length; i++) {
      key = constraintsSortedByPriority[i];
      Object.defineProperty(this, key, {
        get: this.constraints[key]
      });
    }
  }

  get valid() {
    var key, i;
    for (i = 0; i < constraintsSortedByPriority.length; i++) {
      key = constraintsSortedByPriority[i];
      if (this.constraints[key]()) {
        return false;
      }
    }
    return true;
  }

  get constriants() {
    return (this._constraints = this._constraints || {});
  }
}

/**
 * @class A mock of the Constraint validation API on HTMLFormElements to use with input wrapper LWC components
 */
class WrapperComponentConstraints {
  /**
   * @constructor Default constructor for when we have access to the html input(s) being wrapped
   * @param {Function} wrapperComponentProvider should return the wrapperComponentProvider
   * @param {Function} wrappedComponentProvider should return the component/Element being wrapped
   * @param {Object} constraintFnOverrides a map of validation constraints and their custom override functions
   */
  constructor(
    wrapperComponentProvider,
    wrappedComponentProvider,
    constraintFnOverrides,
    theme
  ) {
    this._wrapperProvider = wrapperComponentProvider;
    this._wrappedProvider = wrappedComponentProvider;
    this.overridesProvider = Object.assign({}, constraintFnOverrides);
    this.theme = theme || "slds";
  }

  get validity() {
    return (this._validity =
      this._validity || new ValidityState(this.constraintsProvider));
  }

  get constraintsProvider() {
    if (!this._constraintsProvider) {
      this._constraintsProvider = {};

      constraintsSortedByPriority.forEach(function (constraintKey) {
        if (typeof this.overridesProvider[constraintKey] === "function") {
          this._constraintsProvider[constraintKey] = this.overridesProvider[
            constraintKey
          ].bind(this.wrapperComponent);
        } else if (constraintKey === "customError") {
          this._constraintsProvider[constraintKey] = () =>
            typeof this._customValidityMessage === "string" &&
            this._customValidityMessage !== "";
        } else {
          // eslint-disable-next-line no-confusing-arrow
          this._constraintsProvider[constraintKey] = () =>
            this.wrappedComponent
              ? this.wrappedComponent.validity[constraintKey]
              : false;
        }
      }, this);
    }
    return this._constraintsProvider;
  }

  checkValidity() {
    const isValid = this.validity.valid;

    return isValid;
  }

  reportValidity(callback) {
    const valid = this.checkValidity();

    if (callback) {
      callback(this.validationMessage);
    }

    return valid;
  }

  setCustomValidity(message) {
    this._customValidityMessage = message;
  }

  get validationMessage() {
    return getErrorMessage(this.validity, {
      customError: this._customValidityMessage,
      badInput: this.wrapperComponent.messageWhenBadInput,
      patternMismatch: this.wrapperComponent.messageWhenPatternMismatch,
      rangeOverflow: this.wrapperComponent.messageWhenRangeOverflow,
      rangeUnderflow: this.wrapperComponent.messageWhenRangeUnderflow,
      stepMismatch: this.wrapperComponent.messageWhenStepMismatch,
      tooShort: this.wrapperComponent.messageWhenTooShort,
      tooLong: this.wrapperComponent.messageWhenTooLong,
      typeMismatch: this.wrapperComponent.messageWhenTypeMismatch,
      valueMissing: this.wrapperComponent.messageWhenValueMissing
    });
  }

  get wrapperComponent() {
    if (!this._wrapperComponentElement) {
      this._wrapperComponentElement = this._wrapperProvider();
    }

    return this._wrapperComponentElement;
  }

  get wrappedComponent() {
    return this._wrappedProvider();
  }
}

export default WrapperComponentConstraints;
