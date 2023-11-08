import OmnistudioTypeahead from "omnistudio/typeahead";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniTypeaheadOsN";

export default class SfGpsDsOmniTypeaheadOsN extends SfGpsDsOmniInputMixinOsN(
  OmnistudioTypeahead
) {
  /**
   * For unknown reasons, Omnistudio 246 started adding ${this.theme}-listbox__option to the itemClass of internal items.
   * Reverting it by actually using the item class for the option div contained in the item.
   */

  get sfGpsDsInternalData() {
    return this.internaldata?.map((item) => ({
      ...item,
      itemClass:
        `${this.theme}-listbox__option ${this.theme}-listbox__option--plain` +
        (item.selected ? ` ${this.theme}-has-focus` : "")
    }));
  }

  get _sfGpsDsLastItemClass() {
    return (
      `${this.theme}-listbox__option ${this.theme}-listbox__option--plain ` +
      this.lastItemClass.replace(`${this.theme}-item `, "")
    );
  }

  /* End */

  /* Deal with changes, we should clear custom validation messages */

  updateValue(event) {
    if (DEBUG) console.log(CLASS_NAME, "updateValue");
    this.sfGpsDsClearCustomValidation(false);
    super.updateValue(event);
  }

  selectOption(evt, selectedItemIndex, selectedItemName) {
    if (DEBUG) console.log(CLASS_NAME, "selectOption");
    this.sfGpsDsClearCustomValidation(false);
    super.selectOption(evt, selectedItemIndex, selectedItemName);
  }
}
