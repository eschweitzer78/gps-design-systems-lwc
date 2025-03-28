import { api } from "lwc";
import OmnistudioDatetimePicker from "omnistudio/datetimePicker";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniDatetimePickerOsN";

const TIME_SELECTOR = "[data-sfgpsds-time-picker]";
const DATE_SELECTOR = "[data-sfgpsds-date-picker]";

const I18N = {
  timeLabel: "Time"
};

export default class extends SfGpsDsOmniInputMixinOsN(
  OmnistudioDatetimePicker
) {
  _sfGpsDsTimeElement;

  get timeEl() {
    if (!this._sfGpsDsTimeElement) {
      this._sfGpsDsTimeElement = this.template.querySelector(TIME_SELECTOR);
    }

    return this._sfGpsDsTimeElement;
  }

  _sfGpsDsDateElement;

  get dateEl() {
    if (!this._sfGpsDsDateElement) {
      this._sfGpsDsDateElement = this.template.querySelector(DATE_SELECTOR);
    }

    return this._sfGpsDsDateElement;
  }

  get sfGpsDsTimeLabel() {
    return this.timeLabel == null ? I18N.timeLabel : this.timeLabel;
  }

  setTime(event) {
    this.sfGpsDsClearCustomValidation();
    super.setTime(event);
  }

  /* OmnistudioDatetimePicker does not have validationMessage */

  @api
  get validationMessage() {
    if (DEBUG)
      console.log(CLASS_NAME, "> validationMessage", "label: " + this.label);

    const dvm = this.dateEl.validationMessage;
    const tvm = this.dateEl.validationMessage;
    const rv = this.sfGpsDsGetCustomValidation() || dvm || tvm;

    if (DEBUG) console.log(CLASS_NAME, "< validationMessage", rv);

    return rv;
  }
}
