import OmnistudioTypeahead from "c/sfGpsDsOsrtTypeahead";
import SfGpsDsOmniInputMixin from "c/sfGpsDsOmniInputMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniTypeahead";

export default class extends SfGpsDsOmniInputMixin(OmnistudioTypeahead) {
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

  get _sfGpsDsLastItemClassName() {
    return (
      `${this.theme}-listbox__option ${this.theme}-listbox__option--plain ` +
      this.lastItemClass.replace(`${this.theme}-item `, "")
    );
  }

  /* End */

  /* Deal with changes, we should clear custom validation messages */

  updateValue(event) {
    if (DEBUG) console.debug(CLASS_NAME, "updateValue");
    this.sfGpsDsClearCustomValidation(false);
    super.updateValue(event);
  }

  selectOption(event, selectedItemIndex, selectedItemName) {
    if (DEBUG) console.debug(CLASS_NAME, "selectOption");
    this.sfGpsDsClearCustomValidation(false);
    super.selectOption(event, selectedItemIndex, selectedItemName);
  }
}
