import OmnistudioDatePicker from "omnistudio/datePicker";

export default class SfGpsDsDatePickerOsN extends OmnistudioDatePicker {
  // fix for OS244
  _hideCalendar() {
    if (!this.dropdownTrigger) {
      return;
    }
    if (this.bubbleFocus) {
      this.dropdownTrigger.removeEventListener(
        "focusout",
        this._focusOutHandler
      );
      this.dropdownTrigger.removeEventListener(
        "focusin",
        this._setInteractionFlag
      );
      this.dropdownTrigger.removeEventListener(
        "mousedown",
        this._setInteractionFlag
      );

      delete this.bubbleFocus;
      //this.template.querySelector("[data-id='datePickerBtn']").focus()
    }
    this.dropdownTrigger.classList.remove(`${this.theme}-is-open`);
    this.render();
  }
}
