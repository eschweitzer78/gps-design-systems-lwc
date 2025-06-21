import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api name;
  @api label;
  @api tabIndex = "0";

  @api fieldLevelHelp; // String
  @api fieldLevelHelpPosition;

  @api alignment; // one of horizontal, vertical

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
