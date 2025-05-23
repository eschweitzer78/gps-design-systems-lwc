import { api } from "lwc";
import OmnistudioTextarea from "omnistudio/textarea";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniTextareaOsN";

export default class extends SfGpsDsOmniInputMixinOsN(OmnistudioTextarea) {
  /* methods */

  updateValue(event) {
    if (DEBUG) console.debug(CLASS_NAME, "updateValue");
    this.sfGpsDsClearCustomValidation(false);
    super.updateValue(event);
  }

  validateError(event) {
    if (DEBUG) console.debug(CLASS_NAME, "validateError");
    this.sfGpsDsClearCustomValidation(false);
    super.validateError(event);
  }

  @api
  get validationMessage() {
    if (DEBUG)
      console.debug(CLASS_NAME, "> validationMessage", "label: " + this.label);
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.debug(CLASS_NAME, "< validationMessage", rv);

    return rv;
  }
}
