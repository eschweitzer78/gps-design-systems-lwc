/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

const CLOSE_ACTION = "close";
const OPEN_ACTION = "open";

const CSTYLE_LIGHT = "light";
const CSTYLE_DARK = "dark";
const CSTYLE_VALUES = [CSTYLE_LIGHT, CSTYLE_DARK];
const CSTYLE_DEFAULT = CSTYLE_LIGHT;

const I18N = {
  openAll: "Open all",
  closeAll: "Close all"
};

export default class extends ExpandableStateMixin(LightningElement) {
  @api className;

  /* api: cstyle */

  _cstyle;
  _cstyleOriginal;

  @api get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT
    });
  }

  /* items */

  mapItem(item, index, length, active) {
    let indexP1 = index + 1;
    return {
      ...item,
      index: indexP1,
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
    return computeClass({
      js: true,
      "qld__accordion-group": true,
      "qld__accordion-group--dark": this._cstyle === CSTYLE_DARK,
      [this.className]: this.className
    });
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
    return computeClass({
      "qld__accordion__toggle-btn": true,
      "qld__accordion__toggle-btn--closed": !this.allExpanded,
      "qld__accordion__toggle-btn--open": this.allExpanded
    });
  }

  /* event management */

  handleToggleAll() {
    this.toggleAll();
  }

  handleToggleItem(event) {
    const index = Number(event.currentTarget.index);
    this.toggleIndex(index);
  }

  /* methods */

  @api
  toggleAll() {
    const isAllExpanded = super.toggleAll();

    this.dispatchEvent(
      new CustomEvent("toggleall", {
        detail: isAllExpanded ? OPEN_ACTION : CLOSE_ACTION
      })
    );

    return isAllExpanded;
  }

  @api
  toggleIndex(index) {
    const isActive = super.toggleIndex(index);

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
}