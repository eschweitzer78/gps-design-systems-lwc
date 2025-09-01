import { api } from "lwc";
import OmnistudioCombobox from "c/sfGpsDsOsrtCombobox";
import SfGpsDsOmniInputMixin from "c/sfGpsDsOmniInputMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsOmniCombobox";

export default class extends SfGpsDsOmniInputMixin(OmnistudioCombobox) {
  /***
   *
   * setAriaAttributes in original combobox assumes that all items would be theme-is-selected
   * at all times, which is strange. Let us set that class only when the item has actually
   * been checked/selected.
   */

  setAriaAttributes(newIndex) {
    const t = this.template.querySelectorAll(`.${this.theme}-listbox__option`);

    for (let i = 0; i < t.length; i++) {
      const item = t[i];
      const itemValue = this.internalOptionsCopy[i].value;

      if (itemValue && this.valueMap.includes(itemValue)) {
        item.classList.add(`${this.theme}-is-selected`);
        item.setAttribute("aria-checked", "true");
      } else {
        item.classList.remove(`${this.theme}-is-selected`);
        item.setAttribute("aria-checked", "false");
      }

      if (i === newIndex) {
        item.classList.add(`${this.theme}-has-focus`);
        item.setAttribute("aria-selected", "true");

        this.activeDescendant = this.internalOptionsCopy[newIndex].optId;

        if (item.scrollIntoView) {
          item.scrollIntoView({
            block: "nearest"
          });
        }
      } else {
        item.classList.remove(`${this.theme}-has-focus`);
        item.setAttribute("aria-selected", "false");
      }
    }
  }

  /* clear custom val on change */

  selectOption(event, selectedOption) {
    if (DEBUG) console.debug(CLASS_NAME, "selectOption");

    this.sfGpsDsClearCustomValidation(false);
    super.selectOption(event, selectedOption);
  }

  /***
   * There is a missing capability in the original Combobox, it does not
   * report validationMessage correctly. Let's address it.
   */

  @api
  get validationMessage() {
    const rv = this.sfGpsDsErrorMessage;
    if (DEBUG) console.debug(CLASS_NAME, "validationMessage", rv);
    return rv;
  }
}
