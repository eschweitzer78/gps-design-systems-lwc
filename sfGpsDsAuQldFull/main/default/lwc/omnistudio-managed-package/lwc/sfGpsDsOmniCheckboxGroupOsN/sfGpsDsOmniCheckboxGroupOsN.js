import { api } from "lwc";
import OmnistudioCheckboxGroup from "omnistudio/checkboxGroup";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniCheckboxGroupOsN";

export default class extends SfGpsDsOmniInputMixinOsN(OmnistudioCheckboxGroup) {
  /* event management */

  sfGpsDsOnChangeValue(event) {
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsOnChangeValue");

    this.sfGpsDsClearCustomValidation(false);
    super.onchangevalue(event);
  }

  /***
   * There is a bug or missing capability in the original Checkbox group that it does not
   * report validationMessage correctly. Let's address it.
   */

  @api
  get validationMessage() {
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.debug(CLASS_NAME, "validationMessage", rv);
    return rv;
  }
}
