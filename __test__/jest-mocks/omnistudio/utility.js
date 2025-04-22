class WrapperComponentConstraints {
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

const getCommunityPrefix = () => "/test";

export { WrapperComponentConstraints, getCommunityPrefix };
