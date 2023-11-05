import { api } from "lwc";
import OmnistudioDatePicker from "omnistudio/datePicker";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = true;
const CLASS_NAME = "SfGpsDsOmniDatePickerOsN";

export default class SfGpsDsOmniDatePickerOsN extends SfGpsDsOmniInputMixinOsN(
  OmnistudioDatePicker
) {
  assignDate(value) {
    if (DEBUG) console.log(CLASS_NAME, "assignDate", value);
    this.sfGpsDsClearCustomValidation(false);
    super.assignDate(value);
  }

  /***
   * There's an oddity with Omnistudio's datePicker and there are cases when
   * the order attribute assignment ends up happening in leads to the wrong outcome, e.g.
   * - a value is set in yyyy-MM-dd format,
   * - the format is not yet set (but configured as "dd-MM-yyyy" in the parent)
   * - but the outputFormat is not yet set (but configured as "yyyy-MM-dd" in the parent)
   *
   * When trying to parse the value, it will end up leveraging the outputFormat. No value
   * is set, so outputFormat defaults to the following expression:
   * this.dateOutputFormat || dateFormat.toUpperCase() || "YYYY-MM-DD"
   * With this.dateOutputFormat only being assigned when outputFormat is set, the second
   * term kicks in as "M/D/YYYY".
   *
   * It eventually ends up being converted to a moment.js using "M/D/YYYY" as the format
   * in dateValueParser, i.e. an invalid date.
   * It does not matches with the UTCPpattern as it doesn't have time info...
   * and ends up being assigned to lastInvalid.
   *
   * There is logic to deal with invalid values in the renderedCallback, but it does not
   * kick in on firstRender which is probably wrong.
   ***/

  renderedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "renderedCallback", this.lastInvalid);
    super.renderedCallback();

    if (this.lastInvalid) {
      let tmp = this.dateValueParser(this.lastInvalid);
      if (tmp && this.valueAsDate !== tmp) {
        this.assignDate(tmp);
      }

      delete this.lastInvalid;
    }
  }

  /***
   * There is a bug or missing capability in the original date picker that it does not
   * report validationMessage correctly. Let's address it.
   ***/

  @api
  get validationMessage() {
    if (DEBUG)
      console.log(CLASS_NAME, "> validationMessage", "label: " + this.label);
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.log(CLASS_NAME, "< validationMessage", rv);

    return rv;
  }
}
