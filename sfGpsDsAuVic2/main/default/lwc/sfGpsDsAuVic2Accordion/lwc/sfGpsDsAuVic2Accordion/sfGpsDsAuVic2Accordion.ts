/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { computeClass } from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

const NUMBERED_DEFAULT = false;

const CLOSE_ACTION = "close";
const OPEN_ACTION = "open";

const I18N = {
  openAll: "Open all",
  closeAll: "Close all"
};

export default 
class SfGpsDsAuVic2Accordion 
extends ExpandableStateMixin<SfGpsDsElement>(
  SfGpsDsElement
) {
  // @ts-ignore
  @api
  numbered?: boolean;
  _numbered = this.defineBooleanProperty("numbered", {
    defaultValue: NUMBERED_DEFAULT
  });

  // @ts-ignore
  @api 
  className?: string;

  /* items */

  mapItem(
    item: any, 
    index: number, 
    _length: number, 
    active: boolean
  ): any {
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

  // @ts-ignore
  @api
  get allExpanded() {
    return super.isAllExpanded();
  }

  /* api readonly: allCollapsed */

  // @ts-ignore
  @api
  get allCollapsed() {
    return super.isAllCollapsed();
  }

  /* computed: computedClassName */

  get computedClassName(): any {
    return {
      "rpl-accordion": true,
      [this.className || ""]: !!this.className
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

  /* methods */

  // @ts-ignore
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

  // @ts-ignore
  @api
  toggleItemByIndex(index: number) {
    const isActive = super.toggleItemByIndex(index);

    if (isActive == null) return null;

    this.dispatchEvent(
      new CustomEvent("toggleitem", {
        detail: {
          index: index,
          action: isActive ? OPEN_ACTION : CLOSE_ACTION
        }
      })
    );

    return isActive;
  }
  /* event management */

  handleToggleAll() {
    this.toggleAll();
  }

  handleToggleItem(event: MouseEvent): void {
    const currentTarget = event.currentTarget as HTMLElement;
    const index = Number(currentTarget.dataset.idx);
    this.toggleItemByIndex(index);
  }
}
