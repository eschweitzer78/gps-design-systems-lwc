import { api } from "lwc";
import OmnistudioRadioGroup from "c/sfGpsDsOsrtRadioGroup";
import SfGpsDsOmniInputMixin from "c/sfGpsDsOmniInputMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniRadioGroup";

export default class extends SfGpsDsOmniInputMixin(OmnistudioRadioGroup) {
  /* event management */

  sfGpsDsOnChangeValue(event) {
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsOnChangeValue");

    this.sfGpsDsClearCustomValidation(false);
    super.onchangevalue(event);
  }

  /***
   * There is a bug or missing capability in the original Radio group that it does not
   * report validationMessage correctly. Let's address it.
   */

  @api
  get validationMessage() {
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.debug(CLASS_NAME, "validationMessage", rv);
    return rv;
  }

  renderedCallback() {
    // assumptions about slds in renderedCallback, ignore
  }
}
