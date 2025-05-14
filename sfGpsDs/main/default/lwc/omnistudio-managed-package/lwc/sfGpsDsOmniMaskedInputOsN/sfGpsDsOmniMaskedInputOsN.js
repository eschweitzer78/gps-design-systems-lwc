import OmnistudioMaskedInput from "omnistudio/maskedInput";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniMaskedInputOsN";

export default class extends SfGpsDsOmniInputMixinOsN(OmnistudioMaskedInput) {
  /* event management */

  sfGpsDsHandleChange(event) {
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsHandleChange");

    this.sfGpsDsClearCustomValidation(false);
    super.handleChange(event);
  }
}
