/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTypeahead from "omnistudio/typeahead";

export default class sfGpsDsTypeaheadOsN extends OmnistudioTypeahead {
  /**
   * For unknown reasons, Omnistudio 246 started adding ${this.theme}-listbox__option to the itemClass of internal items.
   * Reverting it by actually using the item class for the option div contained in the item.
   */

  get _sfGpsDsInternalData() {
    return this.internaldata?.map((item) => ({
      ...item,
      itemClass:
        `${this.theme}-media ${this.theme}-listbox__option ${this.theme}-listbox__option_entity ${this.theme}-listbox__option_has-meta` +
        (item.selected ? ` ${this.theme}-has-focus` : "")
    }));
  }

  get _sfGpsDsLastItemClass() {
    return (
      `${this.theme}-media ${this.theme}-listbox__option_entity ${this.theme}-listbox__option_has-meta ` +
      this.lastItemClass.replace(`${this.theme}-item `, "")
    );
  }

  /* End */
}
