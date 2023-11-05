import { api } from "lwc";
import OmnistudioTimePicker from "omnistudio/timePicker";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = true;
const CLASS_NAME = "SfGpsDsOmniTimePickerOsN";

export default class SfGpsDsOmniTimePickerOsN extends SfGpsDsOmniInputMixinOsN(
  OmnistudioTimePicker
) {
  // fixing a slight bug in the parent showDropdown when the -is-open class is not set right
  // e.g. showDropdown when dropdown was already shown will have -is-open removed.
  showDropdown() {
    super.showDropdown();

    let e = this.template.querySelector(
      `.${this.theme}-dropdown-trigger_click`
    );
    e.classList.add(`${this.theme}-is-open`);
  }

  // fixing an inconsistency of the timePicker: with the select widget, clicking on an open widget
  // closes it whereas it keeps it open on timePicker.
  showLookup(e) {
    if (!this.readOnly) {
      if ("mousedown" === e.type) {
        if (this._isOpen) {
          this.hideDropdown();
        } else {
          this.showDropdown();
        }

        return;
      }
    }

    super.showLookup(e);
  }

  /* override scrollByIndex as the implementation in ommni246 makes assumptions about option line-height */

  // eslint-disable-next-line no-unused-vars
  scrollByIndex(isUp) {
    let option = this.template.querySelector(
      `[data-index="${this._currentSelectedIndex}"]`
    );
    if (!option) return;

    if (option.scrollIntoView) {
      option.scrollIntoView({
        block: "nearest"
      });
    }
  }

  get computedSafeOptions() {
    return this.options || [];
  }

  setTime() {
    if (DEBUG) console.log(CLASS_NAME, "setTime");
    this.sfGpsDsClearCustomValidation(false);
    super.setTime();
  }

  /***
   * There is a bug or missing capability in the original date picker that it does not
   * report validationMessage correctly. Let's address it.
   */

  /*
  @api get validationMessage() {
    const rv = this._constraint.validationMessage;
    if (DEBUG) console.log(CLASS_NAME, "validationMessage", rv);
    return rv;
  }*/

  @api
  get validationMessage() {
    if (DEBUG)
      console.log(CLASS_NAME, "> validationMessage", "label: " + this.label);
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.log(CLASS_NAME, "< validationMessage", rv);

    return rv;
  }
}
