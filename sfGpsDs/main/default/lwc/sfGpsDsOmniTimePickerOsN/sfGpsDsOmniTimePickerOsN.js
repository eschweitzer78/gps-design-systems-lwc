import { api } from "lwc";
import OmnistudioTimePicker from "omnistudio/timePicker";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniTimePickerOsN";

export default class SfGpsDsOmniTimePickerOsN extends SfGpsDsOmniInputMixinOsN(
  OmnistudioTimePicker
) {
  // fixing a slight bug in the parent showDropdown when the -is-open class is not set right
  // e.g. showDropdown when dropdown was already shown will have -is-open removed.
  showDropdown() {
    super.showDropdown();

    let elt = this.template.querySelector(
      `.${this.theme}-dropdown-trigger_click`
    );
    elt.classList.add(`${this.theme}-is-open`);
  }

  // fixing an inconsistency of the timePicker: with the select widget, clicking on an open widget
  // closes it whereas it keeps it open on timePicker.
  showLookup(event) {
    if (!this.readOnly) {
      if (event.type === "mousedown") {
        if (this._isOpen) {
          this.hideDropdown();
        } else {
          this.showDropdown();
        }

        return;
      }
    }

    super.showLookup(event);
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

  @api
  get validationMessage() {
    if (DEBUG)
      console.log(CLASS_NAME, "> validationMessage", "label: " + this.label);
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.log(CLASS_NAME, "< validationMessage", rv);

    return rv;
  }
}
