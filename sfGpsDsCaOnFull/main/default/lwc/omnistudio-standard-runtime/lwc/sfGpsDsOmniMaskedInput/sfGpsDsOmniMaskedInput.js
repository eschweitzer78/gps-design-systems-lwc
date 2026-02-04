import OmnistudioMaskedInput from "c/sfGpsDsOsrtMaskedInput";
import SfGpsDsOmniInputMixin from "c/sfGpsDsOmniInputMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniMaskedInput";

export default class extends SfGpsDsOmniInputMixin(OmnistudioMaskedInput) {
  /* event management */

  sfGpsDsHandleChange(event) {
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsHandleChange");

    this.sfGpsDsClearCustomValidation(false);
    super.handleChange(event);
  }
}
