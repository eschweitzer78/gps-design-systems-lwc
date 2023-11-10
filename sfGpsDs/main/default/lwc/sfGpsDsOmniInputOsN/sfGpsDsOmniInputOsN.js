import { api } from "lwc";
import OmnistudioInput from "omnistudio/input";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniInputOsN";

export default class SfGpsDsOmniInputOsN extends SfGpsDsOmniInputMixinOsN(
  OmnistudioInput
) {
  sfGpsDsTriggerInputEvent(event) {
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsTriggerInputEvent");
    this.sfGpsDsClearCustomValidation(false);
    super.triggerInputEvent(event);
  }

  sfGpsDsValidateError(event, isMaskedInput) {
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsValidateError");
    this.sfGpsDsClearCustomValidation(false);
    super.validateError(event, isMaskedInput);
  }

  @api setCustomValidation(message) {
    if (DEBUG) console.log(CLASS_NAME, "> setCustomValidation", message);
    super.setCustomValidation(message);

    if (this.isCustomLwc && this.childInput?.setCustomValidation) {
      this.childInput.setCustomValidation(message);
    }

    if (DEBUG) console.log(CLASS_NAME, "< setCustomValidation");
  }

  @api sfGpsDsHasCustomValidation() {
    const rv =
      this.isCustomLwc && this.childInput?.sfGpsDsHasCustomValidation
        ? this.childInput.sfGpsDsHasCustomValidation()
        : super.sfGpsDsHasCustomValidation();
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsHasCustomValidation", rv);
    return rv;
  }

  @api sfGpsDsClearCustomValidation() {
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsClearCustomValidation");
    this._sfGpsDsCustomValidation = "";

    if (this.isCustomLwc && this.childInput?.sfGpsDsClearCustomValidation) {
      this.childInput.sfGpsDsClearCustomValidation();
    }
  }

  @api sfGpsDsGetCustomValidation() {
    const rv =
      this.isCustomLwc && this.childInput?.sfGpsDsGetCustomValidation
        ? this.childInput.sfGpsDsGetCustomValidation()
        : super.sfGpsDsGetCustomValidation();
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsGetCustomValidation", rv);
    return rv;
  }

  checkValidity() {
    const scv = super.checkValidity(); // it's important it always gets called as it fires events
    const rv =
      !this.isCustomLwc && this.sfGpsDsHasCustomValidation() ? false : scv;
    if (DEBUG) console.log(CLASS_NAME, "checkValidity", rv);
    return rv;
  }

  reportValidity() {
    const srv = super.reportValidity();
    const rv =
      !this.isCustomLwc && this.sfGpsDsHasCustomValidation() ? false : srv;
    if (DEBUG) console.log(CLASS_NAME, "reportValidity", rv);
    return rv;
  }

  /* Omnistudio's original input does not handle validity or validationMessage
     well if the child is a custom LWC eg date picker */

  get validity() {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> validity",
        "label: " + this.label,
        "isCustomLwc: " + this.isCustomLwc
      );
    const rv = this.isCustomLwc ? this.childInput.validity : super.validity;
    if (DEBUG) console.log(CLASS_NAME, "< validity", rv);

    return rv;
  }

  get validationMessage() {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> validationMessage",
        "label: " + this.label,
        "isCustomLwc: " + this.isCustomLwc
      );
    const rv = this.isCustomLwc
      ? this.childInput.validationMessage
      : this.sfGpsDsErrorMessage;
    if (DEBUG) console.log(CLASS_NAME, "< validationMessage", rv);

    return rv;
  }
}
