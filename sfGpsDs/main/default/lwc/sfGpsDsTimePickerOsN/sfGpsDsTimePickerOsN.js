/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTimePicker from "omnistudio/timePicker";

export default class SfGpsDsTimePickerOsN extends OmnistudioTimePicker {
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
}
