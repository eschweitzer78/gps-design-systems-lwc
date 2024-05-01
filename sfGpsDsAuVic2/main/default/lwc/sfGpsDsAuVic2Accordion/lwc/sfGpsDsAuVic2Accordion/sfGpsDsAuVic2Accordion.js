/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement } from "lwc";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsAuVic2ExpandableStateMixin";

const CLOSE_ACTION = "close";
const OPEN_ACTION = "open";

const I18N = {
  openAll: "Open all",
  closeAll: "Close all"
};

export default class SfGpsDsAuVic2Accordion extends ExpandableStateMixin(
  LightningElement
) {
  @api className;

  /* api : numbered */

  _numberedOriginal = false;
  _numbered = false;

  @api
  get numbered() {
    return this._numberedOriginal;
  }

  set numbered(value) {
    this._numberedOriginal = value;
    this._numbered = normaliseBoolean(value, {
      acceptAsString: true,
      fallbackValue: false
    });
  }

  /* items */

  mapItem(item, index, length, active) {
    let indexP1 = index + 1;
    return {
      ...item,
      index: indexP1,
      toggleId: `sfgpsds-au-vic2-accordion-item-${indexP1}-toggle`,
      contentId: `sfgpsds-au-vic2-accordion-item-${indexP1}-content`,
      className: computeClass({
        "rpl-accordion__item": true,
        "rpl-accordion__item--active": active
      }),
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
      "rpl-accordion": true,
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

  /* event management */

  handleToggleAll() {
    this.toggleAll();
  }

  handleToggleItem(event) {
    const index = Number(event.currentTarget.dataset.idx);
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
