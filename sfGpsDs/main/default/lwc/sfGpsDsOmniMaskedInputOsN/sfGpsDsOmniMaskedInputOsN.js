import OmnistudioMaskedInput from "omnistudio/maskedInput";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = true;
const CLASS_NAME = "SfGpsDsOmniMaskedInputOsN";

export default class SfGpsDsOmniMaskedInput extends SfGpsDsOmniInputMixinOsN(
  OmnistudioMaskedInput
) {
  sfGpsDsHandleChange(event) {
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsHandleChange");

    this.sfGpsDsClearCustomValidation(false);
    super.handleChange(event);
  }
}
