import { api } from "lwc";
import OmnistudioCheckboxGroup from "c/sfGpsDsOsrtCheckboxGroup";
import SfGpsDsOmniInputMixin from "c/sfGpsDsOmniInputMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniCheckboxGroup";

export default class extends SfGpsDsOmniInputMixin(OmnistudioCheckboxGroup) {
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

  renderedCallback() {
    /* ESC-OS: super.renderCallback() assumes there will be an slds annotation; it also does a bit of massaging for SLDS based on orientation but it's not relevant to non-SLDS templates -- probably not the best spot where to do that anyway. Skip.
     */
  }
}
