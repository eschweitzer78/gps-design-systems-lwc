import { api } from "lwc";
import OmnistudioCheckboxGroup from "omnistudio/checkboxGroup";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniCheckboxGroupOsN";

export default class SfGpsDsOmniCheckboxGroupOsN extends SfGpsDsOmniInputMixinOsN(
  OmnistudioCheckboxGroup
) {
  sfGpsDsOnChangeValue(event) {
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsOnChangeValue");

    this.sfGpsDsClearCustomValidation(false);
    super.onchangevalue(event);
  }

  /***
   * There is a bug or missing capability in the original Checkbox group that it does not
   * report validationMessage correctly. Let's address it.
   */

  @api get validationMessage() {
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.log(CLASS_NAME, "validationMessage", rv);
    return rv;
  }
}
