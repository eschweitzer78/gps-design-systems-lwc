/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.10
 */

import { api, LightningElement } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

const CLOSE_ACTION = "close";
const OPEN_ACTION = "open";

const CSTYLE_VALUES = {
  light: "",
  dark: "qld__accordion-group--dark"
};
const CSTYLE_DEFAULT = "light";

const I18N = {
  openAll: "Open all",
  closeAll: "Close all"
};

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldAccordion";

export default class extends ExpandableStateMixin(LightningElement) {
  @api headingLevel;
  @api className;

  /* api: cstyle */

  _cstyle;
  _cstyleOriginal;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* items */

  mapItem(item, index, length, active) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "mapItem", "index=", index, "active=", active);
    }

    return {
      ...item,
      index,
      inactive: !active,
      active: active
    };
  }

  /* api readonly: allExpanded */

  @api
  get allExpanded() {
    return super.isAllExpanded();
  }

  /* api readonly: allCollapsed */

  @api
  get allCollapsed() {
    return super.isAllCollapsed();
  }

  /* computed: computedClassName */

  get computedClassName() {
    return {
      js: true,
      "qld__accordion-group": true,
      [this._cstyle]: this._cstyle,
      [this.className]: this.className
    };
  }

  /* computed: computedToggleAllLabel */

  get computedToggleAllLabel() {
    return this.allExpanded ? I18N.closeAll : I18N.openAll;
  }

  /* computed: computedShowButton */

  get computedShowButton() {
    return this._items.length > 0;
  }

  /* computed: computedButtonClassName */

  get computedButtonClassName() {
    return {
      "qld__accordion__toggle-btn": true,
      "qld__accordion__toggle-btn--closed": !this.allExpanded,
      "qld__accordion__toggle-btn--open": this.allExpanded
    };
  }

  /* methods */

  @api
  toggleAll() {
    if (DEBUG) console.debug(CLASS_NAME, "> toggleAll");

    const isAllExpanded = super.toggleAll();

    this.dispatchEvent(
      new CustomEvent("toggleall", {
        detail: isAllExpanded ? OPEN_ACTION : CLOSE_ACTION
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< toggleAll", isAllExpanded);
    return isAllExpanded;
  }

  @api
  toggleIndex(index) {
    if (DEBUG) console.debug(CLASS_NAME, "> toggleIndex", "index=", index);

    const isActive = super.toggleIndex(index);

    if (DEBUG) console.debug(CLASS_NAME, "< toggleIndex", isActive);

    if (isActive == null) return;

    this.dispatchEvent(
      new CustomEvent("toggleitem", {
        detail: {
          index: index,
          action: isActive ? OPEN_ACTION : CLOSE_ACTION
        }
      })
    );
  }

  /* event management */

  handleToggleAll() {
    this.toggleAll();
  }

  handleToggleItem(event) {
    const index = Number(event.currentTarget.index);
    this.toggleIndex(index);
  }
}
