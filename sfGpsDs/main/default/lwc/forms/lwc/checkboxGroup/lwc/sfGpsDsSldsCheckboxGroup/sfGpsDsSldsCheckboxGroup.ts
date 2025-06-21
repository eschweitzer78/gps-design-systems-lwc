import SfGpsDsCheckboxGroup from "c/sfGpsDsCheckboxGroup";

export default class extends SfGpsDsCheckboxGroup {
  /* computed */

  get computedFieldsetClassName() {
    return {
      "slds-form-element": true,
      "slds-has-error": this._hasError
    };
  }

  get computedFormElementControlClassName() {
    return {
      "slds-form-element__control": true,
      //"slds-grow": true,
      "slds-checkbox-horizontal": this.alignment === "horizontal"
    };
  }
}
